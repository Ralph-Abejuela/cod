import React from "react";
import { renderToStream, Document } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { validRoles } from "@/lib/permissions";
import {
	buildBeneficiariesData,
	buildApplicationStatusData,
	buildProgramUtilizationData,
	type ReportType,
} from "@/lib/report-data";
import BeneficiariesPDF from "@/components/reports/BeneficiariesPDF";
import ApplicationStatusPDF from "@/components/reports/ApplicationStatusPDF";
import ProgramUtilizationPDF from "@/components/reports/ProgramUtilizationPDF";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ type: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { type } = await params;
		const validTypes: ReportType[] = [
			"beneficiaries",
			"application-status",
			"program-utilization",
		];

		if (!validTypes.includes(type as ReportType)) {
			return new Response("Invalid report type", { status: 400 });
		}

		const reportType = type as ReportType;
		let element: React.ReactElement;

		switch (reportType) {
			case "beneficiaries": {
				const data = await buildBeneficiariesData();
				element = <BeneficiariesPDF data={data} />;
				break;
			}
			case "application-status": {
				const data = await buildApplicationStatusData();
				element = <ApplicationStatusPDF data={data} />;
				break;
			}
			case "program-utilization": {
				const data = await buildProgramUtilizationData();
				element = <ProgramUtilizationPDF data={data} />;
				break;
			}
		}

		const stream = await renderToStream(
			element as React.ReactElement<React.ComponentProps<typeof Document>>,
		);

		const filename = `${reportType}.pdf`;
		return new Response(stream as unknown as ReadableStream, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `inline; filename="${filename}"`,
			},
		});
	} catch (error) {
		console.error("Report generation error:", error);
		return new Response("Failed to generate report", { status: 500 });
	}
}
