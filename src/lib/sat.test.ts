import { describe, expect, it } from "vitest";
import { clientFiscalErrors, isGenericRfc, personType, regimesFor, taxObjectError, usesFor } from "./sat";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";

const codes = (entries: { code: string }[]) => entries.map((entry) => entry.code);

describe("validación SAT en el frontend (Fase 6.26)", () => {
  it("distingue persona moral, física, genérico y RFC inválido como el backend", () => {
    expect(personType("CFI010203AB1")).toBe("moral");
    expect(personType(" gode561231gr8 ")).toBe("physical");
    expect(personType("ÑAB000229AB1")).toBe("moral");
    expect(personType("XAXX010101000")).toBe("physical");
    expect(personType("AAA011301AB1")).toBeNull(); // mes 13
    expect(personType("AAA010231AB1")).toBeNull(); // 31 de febrero
    expect(personType("AAA010101AA")).toBeNull();
    expect(isGenericRfc("xexx010101000")).toBe(true);
  });

  it("filtra régimen por tipo de persona y uso por régimen", () => {
    const catalogs = satCatalogsFixture();

    expect(codes(regimesFor(catalogs, "CFI010203AB1"))).toEqual(["601", "626"]);
    expect(codes(regimesFor(catalogs, "GODE561231GR8"))).toEqual(["605", "612", "616", "626"]);
    expect(codes(regimesFor(catalogs, ""))).toHaveLength(5);
    expect(codes(regimesFor(catalogs, "XAXX010101000"))).toEqual(["616"]);

    expect(codes(usesFor(catalogs, "CFI010203AB1", "601"))).toEqual(["G01", "G03", "S01"]);
    expect(codes(usesFor(catalogs, "GODE561231GR8", "605"))).toEqual(["D01", "S01", "CN01"]);
    expect(codes(usesFor(catalogs, "XAXX010101000", ""))).toEqual(["S01"]);
  });

  it("reporta los mismos errores por campo que el backend", () => {
    const catalogs = satCatalogsFixture();

    expect(clientFiscalErrors({ rfc: "CFI010203AB1", codigo_postal: "06600", regimen_fiscal: "601", uso_cfdi: "G03" }, catalogs)).toEqual({});
    expect(clientFiscalErrors({ rfc: "ABC123", codigo_postal: "123", regimen_fiscal: "999", uso_cfdi: "Z01" }, catalogs)).toEqual({
      rfc: expect.stringContaining("formato válido"),
      codigo_postal: "El código postal debe tener 5 dígitos.",
      regimen_fiscal: expect.stringContaining("no existe"),
      uso_cfdi: expect.stringContaining("no existe"),
    });
    expect(clientFiscalErrors({ rfc: "CFI010203AB1", codigo_postal: "06600", regimen_fiscal: "605", uso_cfdi: "D01" }, catalogs)).toEqual({
      regimen_fiscal: "El régimen fiscal 605 no aplica a una persona moral.",
      uso_cfdi: "El uso de CFDI D01 no aplica a una persona moral.",
    });
    expect(clientFiscalErrors({ rfc: "GODE561231GR8", codigo_postal: "06600", regimen_fiscal: "612", uso_cfdi: "CN01" }, catalogs).uso_cfdi)
      .toBe("El uso de CFDI CN01 no es compatible con el régimen fiscal 612.");
    expect(clientFiscalErrors({ rfc: "XAXX010101000", codigo_postal: "06600", regimen_fiscal: "612", uso_cfdi: "G03" }, catalogs)).toEqual({
      regimen_fiscal: expect.stringContaining("616"),
      uso_cfdi: expect.stringContaining("S01"),
    });
  });

  it("con un RFC genérico pide el régimen 616 aunque el elegido aplique a otro tipo de persona (Fase 6.26.1)", () => {
    const catalogs = satCatalogsFixture();
    for (const regime of ["601", "612"]) {
      expect(clientFiscalErrors({ rfc: "XAXX010101000", codigo_postal: "06600", regimen_fiscal: regime, uso_cfdi: "S01" }, catalogs)).toEqual({
        regimen_fiscal: "Con un RFC genérico el régimen fiscal debe ser 616.",
      });
    }
  });

  it("sin catálogos sólo valida formato de RFC y código postal", () => {
    expect(clientFiscalErrors({ rfc: "CFI010203AB1", codigo_postal: "06600", regimen_fiscal: "999", uso_cfdi: "Z01" }, null)).toEqual({});
  });

  it("exige coherencia entre el objeto de impuesto y la tasa de IVA", () => {
    expect(taxObjectError("02", 1)).toBeNull();
    expect(taxObjectError("01", null)).toBeNull();
    expect(taxObjectError("06", 1)).toBeNull();
    expect(taxObjectError("02", null)).toContain("debe tener IVA");
    expect(taxObjectError("03", 3)).toContain("no lleva IVA");
  });
});
