import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 10,
		fontFamily: "Helvetica",
	},
	header: {
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 10,
		textAlign: "center",
		color: "#555",
		marginBottom: 2,
	},
	subtitle2: {
		fontSize: 9,
		textAlign: "center",
		color: "#888",
		marginBottom: 4,
	},
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginBottom: 8,
	},
	reportTitle: {
		fontSize: 13,
		fontWeight: "bold",
		marginBottom: 4,
	},
	reportDate: {
		fontSize: 9,
		color: "#888",
		marginBottom: 8,
	},
	summaryLine: {
		fontSize: 9,
		marginBottom: 8,
	},
	sectionHeading: {
		fontSize: 11,
		fontWeight: "bold",
		marginTop: 8,
		marginBottom: 6,
	},
	table: {
		width: "100%",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
		minHeight: 20,
		alignItems: "center",
	},
	tableHeader: {
		backgroundColor: "#e6e6e6",
		fontWeight: "bold",
	},
	tableRowAlt: {
		backgroundColor: "#f5f5f5",
	},
	cell: {
		paddingHorizontal: 4,
		paddingVertical: 3,
		fontSize: 9,
	},
	cellNum: {
		width: "5%",
	},
	cellName: {
		width: "22%",
	},
	cellGender: {
		width: "10%",
	},
	cellContact: {
		width: "15%",
	},
	cellBarangay: {
		width: "14%",
	},
	cellMunicipality: {
		width: "14%",
	},
	cellStatus: {
		width: "10%",
	},
	cellDate: {
		width: "10%",
	},
	cellProgram: {
		width: "22%",
	},
	cellEnrolled: {
		width: "14%",
		textAlign: "right",
	},
	cellPending: {
		width: "14%",
		textAlign: "right",
	},
	cellApproved: {
		width: "14%",
		textAlign: "right",
	},
	cellAmount: {
		width: "30%",
		textAlign: "right",
		paddingRight: 8,
	},
	cellAssistance: {
		width: "18%",
	},
	footer: {
		position: "absolute",
		bottom: 30,
		left: 40,
		right: 40,
		fontSize: 8,
		color: "#888",
		textAlign: "center",
	},
});
