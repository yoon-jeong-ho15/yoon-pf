import path from "path";
import fs from "fs";

const blogsDirectory = path.join(process.cwd(), "blogs");
// console.log(blogsDirectory);

const files = fs.readdirSync(blogsDirectory);
// console.log(files);

files.forEach((file) => {
	if (file.startsWith(".")) return;
	if (file.startsWith("_")) return;
	const fullPath = path.join(blogsDirectory, file);
	// console.log(fullPath);
	getAllFiles(fullPath);
});

function getAllFiles(dir) {
	// console.log(dir);
	const files = fs.readdirSync(dir);
	console.log(files);
}
