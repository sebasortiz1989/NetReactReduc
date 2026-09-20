using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using WebApiStore.RequestHelpers;

namespace WebApiStore.Services;

public class ImageService
{
    private readonly Cloudinary? cloudinary;

    public ImageService(IOptions<CloudinarySettings> config)
    {
        // Built lazily-tolerant on purpose: Cloudinary is only needed to upload
        // product images. When it is not configured, browsing the catalogue must
        // still work rather than failing every ProductsController action with a 500.
        var settings = config.Value;
        if (string.IsNullOrWhiteSpace(settings.CloudName)
            || string.IsNullOrWhiteSpace(settings.ApiKey)
            || string.IsNullOrWhiteSpace(settings.ApiSecret))
        {
            cloudinary = null;
            return;
        }

        cloudinary = new Cloudinary(new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret));
    }

    public bool IsConfigured => cloudinary != null;

    private Cloudinary RequireCloudinary() => cloudinary
        ?? throw new InvalidOperationException(
            "Image uploads are not available because CloudinarySettings are not configured. "
            + "Set CloudinarySettings:CloudName, :ApiKey and :ApiSecret via user-secrets or environment variables.");

    public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "rs-course",
            };

            uploadResult = await RequireCloudinary().UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await RequireCloudinary().DestroyAsync(deleteParams);
        return result;
    }
}