import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles as s } from "./shared-styles";
import type { ApplicationStatusData } from "./types";

export default function ApplicationStatusPDF({
	data,
}: {
	data: ApplicationStatusData;
}) {
	return (
		<Document>
			<Page size="A4" style={s.page}>
				<View style={s.header}>
					<Text style={s.title}>CAMS</Text>
					<Text style={s.subtitle}>City Action Management System</Text>
					<Text style={s.subtitle2}>
						Municipal Social Welfare & Development Office
					</Text>
					<View style={s.divider} />
					<Text style={s.reportTitle}>Application Status Report</Text>
					<Text style={s.reportDate}>Generated: {data.report.generated}</Text>
				</View>

				{data.groups.map((group, gi) => (
					<View key={gi} wrap={false}>
						<Text style={s.sectionHeading}>
							{group.status} — {group.count} beneficiary
							{group.count !== 1 ? "ies" : "y"}
						</Text>

						<View
							style={{
								...s.tableRow,
								...s.tableHeader,
								borderTopWidth: 0.5,
								borderTopColor: "#ccc",
							}}
						>
							<Text style={{ ...s.cell, ...s.cellNum }}>#</Text>
							<Text style={{ ...s.cell, ...s.cellName }}>Name</Text>
							<Text style={{ ...s.cell, ...s.cellBarangay }}>Barangay</Text>
							<Text style={{ ...s.cell, ...s.cellMunicipality }}>
								Municipality
							</Text>
							<Text style={{ ...s.cell, ...s.cellDate }}>Registered</Text>
						</View>

						{group.beneficiaries.map((b, i) => {
							const name = b.middle
								? `${b.last}, ${b.first} ${b.middle}`
								: `${b.last}, ${b.first}`;
							return (
								<View
									key={i}
									style={{
										...s.tableRow,
										...(i % 2 === 1 ? s.tableRowAlt : {}),
									}}
								>
									<Text style={{ ...s.cell, ...s.cellNum }}>{i + 1}</Text>
									<Text style={{ ...s.cell, ...s.cellName }}>{name}</Text>
									<Text
										style={{
											...s.cell,
											...s.cellBarangay,
										}}
									>
										{b.barangay}
									</Text>
									<Text
										style={{
											...s.cell,
											...s.cellMunicipality,
										}}
									>
										{b.municipality}
									</Text>
									<Text style={{ ...s.cell, ...s.cellDate }}>
										{b.registered}
									</Text>
								</View>
							);
						})}
					</View>
				))}

				<Text
					style={s.footer}
					render={({ pageNumber, totalPages }) =>
						`Page ${pageNumber} of ${totalPages}`
					}
					fixed
				/>
			</Page>
		</Document>
	);
}
