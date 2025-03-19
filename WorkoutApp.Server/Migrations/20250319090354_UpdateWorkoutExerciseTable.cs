using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkoutExerciseTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Measurement",
                table: "Exercise");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "WorkoutExercise",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Reps",
                table: "WorkoutExercise",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Sets",
                table: "WorkoutExercise",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "Weight",
                table: "WorkoutExercise",
                type: "real",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Exercise",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Exercise",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "WorkoutExercise");

            migrationBuilder.DropColumn(
                name: "Reps",
                table: "WorkoutExercise");

            migrationBuilder.DropColumn(
                name: "Sets",
                table: "WorkoutExercise");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "WorkoutExercise");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Exercise");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Exercise",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<float>(
                name: "Measurement",
                table: "Exercise",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
