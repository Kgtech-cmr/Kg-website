import express from "express";
import os from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { version as nodeVersion } from "process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.get("/api", (req, res) => {
	const cpus = os.cpus();
	const serverInfo = {
		name: "kgtech-web",
		version: "1.0.0",
		description: "Server KERM Bot",
		nodeVersion: nodeVersion,
		platform: os.platform(),
		osRelease: os.release(),
		arch: os.arch(),
		cpus: {
			count: cpus.length,
			model: cpus[0].model,
			speed: `${cpus[0].speed} MHz`,
		},
		memory: {
			total: `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
			free: `${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
			usedPercentage: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`,
		},
		uptime: {
			system: formatUptime(os.uptime()),
			process: formatUptime(process.uptime()),
		},
		network: Object.entries(os.networkInterfaces()).reduce((acc, [name, interfaces]) => {
			acc[name] = interfaces.map(int => ({
				address: int.address,
				netmask: int.netmask,
				family: int.family,
				mac: int.mac,
			}));
			return acc;
		}, {}),
		serverTime: {
			iso: new Date().toISOString(),
			utc: new Date().toUTCString(),
			local: new Date().toString(),
		},
	};
	res.json(serverInfo);
});

function formatUptime(seconds) {
	const days = Math.floor(seconds / (3600 * 24));
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

app.get("*", (req, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});

export default app;
