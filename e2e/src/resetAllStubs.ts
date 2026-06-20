import { qiitaMockUrl, zennMockUrl } from "./setUpStubs.js";



export async function resetAllStubs(): Promise<void> {
  await fetch(`${qiitaMockUrl}/__admin/reset`, { method: "POST" });
  await fetch(`${zennMockUrl}/__admin/reset`, { method: "POST" });
}
