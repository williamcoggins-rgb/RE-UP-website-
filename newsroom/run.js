// Directory existence check
const exportDir = path.dirname(config.NEWSROOM_FILE);
if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
}