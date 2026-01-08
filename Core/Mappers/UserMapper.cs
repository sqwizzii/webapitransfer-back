using AutoMapper;
using Core.Models.Account;
using Domain.Entities.Idenity;
namespace Core.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserProfileModel>()
            .ForMember(x => x.UserName, opt => opt.MapFrom(x => $"{x.LastName} {x.FirstName}"))
            .ForMember(x => x.PhoneNumber, opt => opt.MapFrom(x => x.PhoneNumber));
    }
}
