using AutoMapper;
using WebApiStore.DTOs;
using WebApiStore.Entities;

namespace WebApiStore.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}