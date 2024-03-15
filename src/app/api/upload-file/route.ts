// Import necessary modules
import { prisma } from "@/services/database";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

// Define the POST handler for the file upload
export const POST = async (req: any, res: any) => {
  // Parse the incoming form data
  const formData = await req.formData();

  // Get the file from the form data
  const file = formData.get("file");

  // Check if a file is received
  if (!file) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Replace spaces in the file name with underscores
  const filename = file.name.replaceAll(" ", "_");

  const timestamp = new Date().getTime();

  const newFileName = `${timestamp}-${filename}`;

  // const renamedFile = new File([videoFile], newFileName, {
  //   type: videoFile.type,
  // });

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(path.join(process.cwd(), "public/" + newFileName), buffer);

    const res = await prisma.video.create({
      data: {
        name: filename,
        path: newFileName,
      },
    });

    // Return a JSON response with a success message and a 201 status code
    return NextResponse.json(res);
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
