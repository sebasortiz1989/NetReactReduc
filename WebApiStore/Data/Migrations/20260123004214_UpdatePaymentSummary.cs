using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePaymentSummary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentSummary_Last4Digits",
                table: "Orders",
                newName: "PaymentSummary_Last4");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_ExpiryYear",
                table: "Orders",
                newName: "PaymentSummary_ExpYear");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_ExpiryMonth",
                table: "Orders",
                newName: "PaymentSummary_ExpMonth");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_CardBrand",
                table: "Orders",
                newName: "PaymentSummary_Brand");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentSummary_Last4",
                table: "Orders",
                newName: "PaymentSummary_Last4Digits");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_ExpYear",
                table: "Orders",
                newName: "PaymentSummary_ExpiryYear");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_ExpMonth",
                table: "Orders",
                newName: "PaymentSummary_ExpiryMonth");

            migrationBuilder.RenameColumn(
                name: "PaymentSummary_Brand",
                table: "Orders",
                newName: "PaymentSummary_CardBrand");
        }
    }
}
