namespace WorkoutApp.Server.DTO.User
{
    public class UserLoginRequestModel
    {

        public required string NameOrEmail { get; set; }

        public required string Password { get; set; }
    }
}
