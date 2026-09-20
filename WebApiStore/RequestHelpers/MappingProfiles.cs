using Mapster;
using WebApiStore.DTOs;
using WebApiStore.Entities;

namespace WebApiStore.RequestHelpers;

public class MappingProfiles : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Mapster maps same-named members by convention; these entries exist so
        // the mappings are explicit and have a home for future rules.
        config.NewConfig<CreateProductDto, Product>()
            .Ignore(dest => dest.Id);

        config.NewConfig<UpdateProductDto, Product>()
            .Ignore(dest => dest.Id);
    }
}
