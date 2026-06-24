import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles as s } from "./shared-styles";
import type { ProgramUtilizationData } from "./types";

export default function ProgramUtilizationPDF({
	data,
}: {
	data: ProgramUtilizationData;
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
					<Text style={s.reportTitle}>Program Utilization Report</Text>
					<Text style={s.reportDate}>Generated: {data.report.generated}</Text>
					<Text style={s.summaryLine}>
						Total Enrollments: {data.report.total_enrollments} | Total Releases:
						₱{data.report.total_releases}
					</Text>
				</View>

				<Text style={s.sectionHeading}>Program Enrollment Summary</Text>

				<View
					style={{
						...s.tableRow,
						...s.tableHeader,
						borderTopWidth: 0.5,
						borderTopColor: "#ccc",
					}}
				>
					<Text style={{ ...s.cell, ...s.cellProgram }}>Program</Text>
					<Text style={{ ...s.cell, ...s.cellEnrolled }}>Enrolled</Text>
					<Text style={{ ...s.cell, ...s.cellPending }}>Pending</Text>
					<Text style={{ ...s.cell, ...s.cellApproved }}>Approved</Text>
					<Text style={{ ...s.cell, ...s.cellAmount }}>Total Released</Text>
				</View>

				{data.programs.map((p, i) => (
					<View
						key={i}
						style={{
							...s.tableRow,
							...(i % 2 === 1 ? s.tableRowAlt : {}),
						}}
					>
						<Text style={{ ...s.cell, ...s.cellProgram }}>{p.name}</Text>
						<Text style={{ ...s.cell, ...s.cellEnrolled }}>{p.enrolled}</Text>
						<Text style={{ ...s.cell, ...s.cellPending }}>{p.pending}</Text>
						<Text style={{ ...s.cell, ...s.cellApproved }}>{p.approved}</Text>
						<Text style={{ ...s.cell, ...s.cellAmount }}>
							₱{p.total_released}
						</Text>
					</View>
				))}

				{data.programs
					.filter((p) => p.releases.length > 0)
					.map((prog, pi) => (
						<View key={pi} wrap={false}>
							<Text style={s.sectionHeading}>{prog.name} — Releases</Text>

							<View
								style={{
									...s.tableRow,
									...s.tableHeader,
									borderTopWidth: 0.5,
									borderTopColor: "#ccc",
								}}
							>
								<Text style={{ ...s.cell, ...s.cellNum }}>#</Text>
								<Text style={{ ...s.cell, ...s.cellName }}>Beneficiary</Text>
								<Text style={{ ...s.cell, ...s.cellAssistance }}>
									Assistance
								</Text>
								<Text style={{ ...s.cell, ...s.cellAmount }}>Amount</Text>
								<Text style={{ ...s.cell, ...s.cellDate }}>Date</Text>
							</View>

							{prog.releases.map((r, i) => {
								const name = r.beneficiary_middle
									? `${r.beneficiary_last}, ${r.beneficiary_first} ${r.beneficiary_middle}`
									: `${r.beneficiary_last}, ${r.beneficiary_first}`;
								return (
									<View
										key={i}
										style={{
											...s.tableRow,
											...(i % 2 === 1 ? s.tableRowAlt : {}),
										}}
									>
										<Text
											style={{
												...s.cell,
												...s.cellNum,
											}}
										>
											{i + 1}
										</Text>
										<Text
											style={{
												...s.cell,
												...s.cellName,
											}}
										>
											{name}
										</Text>
										<Text
											style={{
												...s.cell,
												...s.cellAssistance,
											}}
										>
											{r.assistance_type}
										</Text>
										<Text
											style={{
												...s.cell,
												...s.cellAmount,
											}}
										>
											₱{r.amount}
										</Text>
										<Text
											style={{
												...s.cell,
												...s.cellDate,
											}}
										>
											{r.date}
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
