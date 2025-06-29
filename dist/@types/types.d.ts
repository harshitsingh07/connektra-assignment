export interface UploadedFileData {
    imageFile: Express.Multer.File;
    tags: string;
    text: string;
    projectId: string;
    folderPath: string;
}
