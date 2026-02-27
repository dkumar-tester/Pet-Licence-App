using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetLicence.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PetApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicantFirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ApplicantLastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    PrimaryAddress = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SecondaryAddress = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PetName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PetType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Breed = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Sex = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    HairLength = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SpayedNeutered = table.Column<bool>(type: "boolean", nullable: false),
                    ClinicName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    VetName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProvisionalLicenceNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    StripePaymentIntentId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetApplications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PetApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Actor = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Action = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    OldValue = table.Column<string>(type: "text", nullable: true),
                    NewValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditLogs_PetApplications_PetApplicationId",
                        column: x => x.PetApplicationId,
                        principalTable: "PetApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_PetApplicationId",
                table: "AuditLogs",
                column: "PetApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AuditLogs");
            migrationBuilder.DropTable(name: "PetApplications");
        }
    }
}
