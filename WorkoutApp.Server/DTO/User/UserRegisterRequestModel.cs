namespace WorkoutApp.Server.DTO.User
{
    public class UserRegisterRequestModel
    {

        public required string Username { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

    }
}
