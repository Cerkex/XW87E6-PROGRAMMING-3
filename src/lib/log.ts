import fs from 'fs/promises';
import path from 'path';

const logPath = path.resolve('static/data/log.json');

export async function logAction(entry: string) {
	try {
		let logs: string[] = [];
		try {
			const data = await fs.readFile(logPath, 'utf-8');
			logs = JSON.parse(data);
		} catch {
			logs = [];
		}
		logs.push(entry);
		await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
	} catch (err) {
		console.error('Failed to write log:', err);
	}
}
