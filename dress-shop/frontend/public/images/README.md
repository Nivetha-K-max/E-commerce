# Product Images

Drop product photos into this folder (`frontend/public/images/`).

They'll be served at `/images/filename.jpg` in the frontend.

## Using local images in the admin

When adding a product in the admin dashboard, paste the URL as:
```
/images/your-photo.jpg
```

## Using uploaded images (via backend)

1. In the admin form, click **Choose File** and pick a JPG/PNG/WEBP (max 5 MB).
2. The file is uploaded to `backend/src/main/resources/uploads/` and the URL is auto-filled.
3. The backend serves it at `http://localhost:8080/uploads/filename.jpg`.

> **Deployment note:** Render's free tier has ephemeral storage — uploaded images are lost on redeploy.
> For production, swap the upload endpoint to use S3 or Cloudinary.
