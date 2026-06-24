import fs from 'fs';
import https from 'https';
import path from 'path';

const locationsDir = path.join(process.cwd(), 'lib', 'data', 'locations');

if (!fs.existsSync(locationsDir)) {
    fs.mkdirSync(locationsDir, { recursive: true });
}

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
};

async function run() {
    try {
        console.log("Downloading provinces...");
        await download('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/json/refprovince.json', path.join(locationsDir, 'provinces.json'));
        
        console.log("Downloading municipalities...");
        await download('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/json/refcitymun.json', path.join(locationsDir, 'municipalities.json'));
        
        console.log("Downloading barangays...");
        await download('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/json/refbrgy.json', path.join(locationsDir, 'barangays.json'));
        
        console.log("Downloads complete!");
    } catch (e) {
        console.error(e);
    }
}

run();
