using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymApp.Server.Migrations
{
    public partial class UpdateGymClassSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymClasses_Users_TrainerId",
                table: "GymClasses");

            migrationBuilder.InsertData(
                table: "GymClasses",
                columns: new[] { "Id", "EndTime", "MaxCapacity", "Name", "Room", "StartTime", "TrainerId" },
                values: new object[] { 1, new DateTime(2026, 6, 14, 11, 30, 0, 0, DateTimeKind.Local), 15, "Joga dla początkujących", "Sala A (Lustrzana)", new DateTime(2026, 6, 14, 10, 0, 0, 0, DateTimeKind.Local), 2 });

            migrationBuilder.InsertData(
                table: "GymClasses",
                columns: new[] { "Id", "EndTime", "MaxCapacity", "Name", "Room", "StartTime", "TrainerId" },
                values: new object[] { 2, new DateTime(2026, 6, 14, 18, 0, 0, 0, DateTimeKind.Local), 12, "Intensywny CrossFit", "Strefa Wolnych Ciężarów", new DateTime(2026, 6, 14, 17, 0, 0, 0, DateTimeKind.Local), 2 });

            migrationBuilder.InsertData(
                table: "GymClasses",
                columns: new[] { "Id", "EndTime", "MaxCapacity", "Name", "Room", "StartTime", "TrainerId" },
                values: new object[] { 3, new DateTime(2026, 6, 15, 19, 0, 0, 0, DateTimeKind.Local), 20, "Trening Cardio", "Sala B (Rowery)", new DateTime(2026, 6, 15, 18, 0, 0, 0, DateTimeKind.Local), 2 });

            migrationBuilder.AddForeignKey(
                name: "FK_GymClasses_Users_TrainerId",
                table: "GymClasses",
                column: "TrainerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymClasses_Users_TrainerId",
                table: "GymClasses");

            migrationBuilder.DeleteData(
                table: "GymClasses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "GymClasses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "GymClasses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.AddForeignKey(
                name: "FK_GymClasses_Users_TrainerId",
                table: "GymClasses",
                column: "TrainerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
