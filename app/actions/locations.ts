"use server";

import fs from "fs";
import path from "path";

// Helper to safely read JSON files
function readLocationFile(filename: string) {
	try {
		const filePath = path.join(process.cwd(), "lib", "data", "locations", filename);
		const fileContents = fs.readFileSync(filePath, "utf8");
		return JSON.parse(fileContents).RECORDS;
	} catch (error) {
		console.error(`Error reading ${filename}:`, error);
		return [];
	}
}

export async function getProvinces() {
	const provinces = readLocationFile("provinces.json");
	// Sort alphabetically
	return provinces.sort((a: any, b: any) => a.provDesc.localeCompare(b.provDesc));
}

export async function getMunicipalities(provCode: string) {
	if (!provCode) return [];
	const municipalities = readLocationFile("municipalities.json");
	const filtered = municipalities.filter((m: any) => m.provCode === provCode);
	return filtered.sort((a: any, b: any) => a.citymunDesc.localeCompare(b.citymunDesc));
}

export async function getBarangays(citymunCode: string) {
	if (!citymunCode) return [];
	const barangays = readLocationFile("barangays.json");
	const filtered = barangays.filter((b: any) => b.citymunCode === citymunCode);
	return filtered.sort((a: any, b: any) => a.brgyDesc.localeCompare(b.brgyDesc));
}
