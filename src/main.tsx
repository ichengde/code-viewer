import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { readdir, readFile, lstat } from "node:fs/promises";
import { Layout } from "./Layout";
import { basicAuth } from "hono/basic-auth";
import assert from "node:assert";
import { streamText } from "hono/streaming";
import type { StreamingApi } from "hono/utils/stream";
import { spawn } from "node:child_process";
import { logger } from "hono/logger";

export const app = new Hono();

assert(process.env.username !== undefined, "username is missing.");
assert(process.env.password !== undefined, "password is missing.");
app.use(logger());
app.use(
	"/static/*",
	serveStatic({
		root: "./",
		onNotFound: (c) => {
			console.log(c);
		},
		// rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
	}),
);

const authPass = basicAuth({
	username: process.env.username,
	password: process.env.password,
});

app
	.get("/", authPass, async (c) => {
		try {
			const q = c.req.query("q") ?? "";

			const basePath = process.env.source_path ?? "/app/source";
			const path = `${basePath}/${q}`;
			const stat = await lstat(path);

			if (stat.isFile()) {
				const content = await readFile(path);

				return c.html(
					<Layout title={q} description={""} image={""}>
						<pre>
							{/* class='whitespace-pre-wrap' */}
							<code>{content.toString()}</code>
						</pre>
					</Layout>,
				);
			}

			const files = await readdir(path);

			return c.html(
				<Layout title={"index"} description={""} image={""}>
					{/* <div class='w-dvw'>class="w-dvw"</div> */}
					<div class="px-2 py-1 text-lg block ">pwd: {q === "" ? "/" : q}</div>
					<div class={"flex flex-col divide-y mt-2"}>
						{files.map((i) => (
							<a
								class={"px-2 py-1 block text-lg break-all"}
								href={`/?q=${`${q}/${i}`}`}
							>
								{i}
							</a>
						))}
					</div>
				</Layout>,
			);
		} catch (err) {
			console.error(err);
		}
	})
	.get("/clone", authPass, async (c) => {
		try {
			const gitUrl = c.req.query("git-url") ?? "";
			const basePath = process.env.source_path ?? "/app/source";

			const startTask = (stream: StreamingApi) => {
				return new Promise<void>((resolve, reject) => {
					const buildBlogScript = spawn(
						"git",
						["clone", "--depth=1", `${gitUrl}`],
						{
							cwd: basePath,
						},
					);
					buildBlogScript.stdout.on("data", (d) => {
						stream.write(d);
					});
					buildBlogScript.stderr.on("data", (d) => {
						stream.write(d);
					});

					buildBlogScript.on("error", (err) => {
						stream.writeln(err.message);
						console.error(err);
						reject();
						process.exit(1);
					});

					buildBlogScript.on("exit", () => {
						stream.writeln("done");
						resolve();
					});
				});
			};

			return streamText(c, async (stream) => {
				await stream.writeln("start");
				await startTask(stream);
			});
		} catch (err) {
			console.error(err);
		}
	});
