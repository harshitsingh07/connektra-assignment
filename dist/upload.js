"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToAutodesk = uploadToAutodesk;
const node_fetch_1 = __importDefault(require("node-fetch"));
const auth_1 = require("./auth");
async function uploadToAutodesk({ imageFile, tags, text, projectId, folderPath }) {
    const token = await (0, auth_1.getAccessToken)();
    const folderUrn = `urn:adsk.wipprod:fs.folder:co.${folderPath}`;
    const storageRes = await (0, node_fetch_1.default)(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/storage`, {
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
    const storageData = await storageRes.json();
    const objectId = storageData.data.id;
    const uploadUrl = storageData.included[0].relationships.upload.href;
    await (0, node_fetch_1.default)(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": imageFile.mimetype,
        },
        body: imageFile.buffer,
    });
    const versionRes = await (0, node_fetch_1.default)(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions`, {
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
//# sourceMappingURL=upload.js.map