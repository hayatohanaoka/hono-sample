import fs from "node:fs/promises";
import path from "node:path";

const qiitaMockUrl = process.env.QIITA_URL!;
const zennMockUrl = process.env.ZENN_URL!;

export async function setUpStubs(callerFilePath: string) {
  const qiitaFixtureDir = createFixtureDirPath(callerFilePath, 'qiita');
  const zennFixtureDir = createFixtureDirPath(callerFilePath, 'zenn');

  await fs.readdir(qiitaFixtureDir).then(files => setUpMappings(files, qiitaFixtureDir, qiitaMockUrl))
  await fs.readdir(zennFixtureDir).then(files => setUpMappings(files, zennFixtureDir, zennMockUrl))
}


async function setUpMappings(jsonFiles: string[], fixtureDir: string, mockServerUrl: string) {
  for (const jsonFile of jsonFiles) {
    const response = await setUpMapping(fixtureDir, jsonFile, mockServerUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to register stub ${jsonFile}: ${response.statusText}`
      );
    }
  }
}

async function setUpMapping(fixtureDir: string, jsonFile: string, mockServerUrl: string | undefined) {
  const filePath = path.join(fixtureDir, jsonFile);
  const content = await fs.readFile(filePath, "utf-8");

  const response = await fetch(`${mockServerUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: content,
  });
  return response;
}

function createFixtureDirPath(callerFilePath: string, serviceName: string) {
  const testName = path
    .basename(callerFilePath, path.extname(callerFilePath))
    .replace(/\.(test|ts)$/, "");

  const fixtureDir = path.join(
    path.dirname(callerFilePath).replace(/tests/, "fixtures"),
    testName,
    serviceName,
  );


  console.log('fixtureDir', fixtureDir);
  return fixtureDir;
}


export async function resetAllStubs(): Promise<void> {
  await fetch(`${qiitaMockUrl}/__admin/reset`, {method: "POST"});
  await fetch(`${zennMockUrl}/__admin/reset`, {method: "POST"});
}
