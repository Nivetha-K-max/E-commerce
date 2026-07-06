# Adding product images (from Google / print)

This project displays product photos from `product.imageUrl`.
The backend already supports uploading images and returns a working `imageUrl`.

## Recommended workflow (works with your current code)
1. **Pick images from Google Images** (or print screenshots).
2. **Download** each image to your computer as JPG/PNG/WEBP (preferred: JPG/PNG).
3. Go to the **Admin → Products → Add Product** screen (the UI that uses `ProductForm`).
4. In **Product photo**, use the file input to upload the downloaded image.
   - The backend endpoint is: `POST /api/upload`
   - Allowed types: `image/jpeg`, `image/png`, `image/webp`
   - Max size: `5MB`
5. After upload, the form auto-fills `imageUrl` and you can save the product.
6. You can also paste an image URL directly in the **Product photo** field (supported in the admin **ProductForm**).
7. Refresh the storefront pages (`/products`, `/products/:id`, etc.) to see the new image.

## Where uploads are stored
The backend saves uploaded files into:
- `dress-shop/backend/src/main/resources/uploads/`

And serves them via:
- `server.base-url` + `/uploads/<filename>`

## Notes / tips
- If your Google image is large, resize/compress it to stay under **5MB**.
- For best quality, use images with a product-focused crop (portrait aspect like your UI: ~3:4).
- Ensure the `imageUrl` field on the product is exactly the value returned by the upload action.

