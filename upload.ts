import fetch from "node-fetch";
import { getAccessToken } from "./auth";
import { UploadedFileData } from "./types";

export async function uploadToAutodesk({ imageFile, tags, text, projectId, folderPath }: UploadedFileData) {
  const token = await getAccessToken();
  const folderUrn = `urn:adsk.wipprod:fs.folder:co.${folderPath}`;

  const storageRes = await fetch(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/storage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "objects",
        attributes: {
          name: imageFile.originalname,
        },
        relationships: {
          target: {
            data: {
              type: "folders",
              id: folderUrn,
            },
          },
        },
      },
    }),
  });

  const storageData: any = await storageRes.json();
  const objectId = storageData.data.id;
  const uploadUrl = storageData.included[0].relationships.upload.href;

  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": imageFile.mimetype,
    },
    body: imageFile.buffer,
  });

  const versionRes = await fetch(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "versions",
        attributes: {
          name: imageFile.originalname,
          description: text,
        },
        relationships: {
          storage: {
            data: {
              type: "objects",
              id: objectId,
            },
          },
        },
      },
    }),
  });

  const versionData = await versionRes.json();
  return versionData;
}