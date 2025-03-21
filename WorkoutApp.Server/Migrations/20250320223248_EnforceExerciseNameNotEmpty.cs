using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class EnforceExerciseNameNotEmpty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure the column is NOT NULL
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Exercise",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            // Add a check constraint to enforce non-empty strings (if supported by the database)
            migrationBuilder.AddCheckConstraint(
                name: "CK_Exercise_Name_NotEmpty",
                table: "Exercise",
                sql: "LEN(Name) > 0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert the changes
            migrationBuilder.DropCheckConstraint(
                name: "CK_Exercise_Name_NotEmpty",
                table: "Exercise");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Exercise",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 255);
        }
    }
}
