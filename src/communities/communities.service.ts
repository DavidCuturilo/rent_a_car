import { VoziloRequestDto } from './../dto/request/vozilo-request.dto';
import { ZahtevRequestDto } from './../dto/request/zahtev-request.dto';
import { GradRequestDto } from './../dto/request/grad-request.dto';
import { AddressRequestDto } from './../dto/request/address-request.dto';
import { db } from './../db/connection';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PonudaRequestDto } from 'src/dto/request/ponuda-request.dto';

@Injectable()
export class CommunitiesService {
  async getAllAddress() {
    try {
      const query = `SELECT a."adresaID",a.ulica, a.broj, g."nazivGrada", d."nazivDrzave" FROM grad g JOIN adresa a ON g."gradID" = a."gradID" JOIN drzava d ON a."drzavaID" = d."drzavaID";`;
      const db_response = await db.query(query);
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting addresses');
    }
  }

  async insertAddress(adresa: AddressRequestDto) {
    try {
      const queryGrad = `SELECT * FROM grad WHERE "nazivGrada"=$1;`;
      const { gradID } = (await db.query(queryGrad, [adresa.nazivGrada]))
        .rows[0];
      const queryDrzava = `SELECT * FROM drzava WHERE "nazivDrzave"=$1;`;
      const { drzavaID } = (await db.query(queryDrzava, [adresa.nazivDrzave]))
        .rows[0];
      const queryAdresa = `INSERT INTO adresa("gradID", "drzavaID", ulica, broj) VALUES($1,$2,$3,$4);`;
      const updatedRows = await db.query(queryAdresa, [
        gradID,
        drzavaID,
        adresa.ulica,
        adresa.broj,
      ]);
      if (updatedRows.rowCount > 0)
        return { message: 'Address successfully inserted.' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while inserting address!');
    }
  }

  async updateAddressById(adresa: AddressRequestDto) {
    try {
      const queryDrzava = `SELECT * FROM drzava WHERE "nazivDrzave"=$1;`;
      const { drzavaID } = (await db.query(queryDrzava, [adresa.nazivDrzave]))
        .rows[0];
      const query = `UPDATE adresa SET ulica=$1, broj=$2, "drzavaID"=$3 WHERE "adresaID"=$4;`;
      const updatedRows = await db.query(query, [
        adresa.ulica,
        adresa.broj,
        drzavaID,
        adresa.adresaID,
      ]);
      if (updatedRows.rowCount > 0)
        return { message: 'Address successfully updated.' };
      else return { message: 'No changes were recorded' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while updating address!');
    }
  }

  async deleteAddressById(adresaID: Pick<AddressRequestDto, 'adresaID'>) {
    try {
      const query = `DELETE FROM adresa WHERE "adresaID"=$1;`;
      const updatedRows = await db.query(query, [adresaID]);
      if (updatedRows.rowCount > 0)
        return { message: 'Address successfully deleted' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while deleting address!');
    }
  }

  async getAllGrad() {
    try {
      const query = `SELECT g."gradID", g."nazivGrada", d."nazivDrzave" FROM grad g JOIN drzava d ON g."drzavaID" = d."drzavaID";`;
      const db_response = await db.query(query);
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting gradovi');
    }
  }

  async insertGrad(grad: GradRequestDto) {
    try {
      const queryDrzava = `SELECT * FROM drzava WHERE "nazivDrzave"=$1;`;
      const { drzavaID } = (await db.query(queryDrzava, [grad.nazivDrzave]))
        .rows[0];
      const query = `INSERT INTO grad("drzavaID", "nazivGrada") VALUES($1,$2);`;
      const updatedRows = await db.query(query, [drzavaID, grad.nazivGrada]);
      if (updatedRows.rowCount > 0)
        return { message: 'Grad successfully inserted.' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while inserting grad!');
    }
  }

  async updateGradById(grad: GradRequestDto) {
    try {
      const query = `UPDATE grad SET "nazivGrada"=$1 WHERE "gradID"=$2;`;
      const updatedRows = await db.query(query, [grad.nazivGrada, grad.gradID]);
      if (updatedRows.rowCount > 0)
        return { message: 'Grad successfully updated.' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while updating grad!');
    }
  }

  async deleteGradById(gradID: Pick<GradRequestDto, 'gradID'>) {
    try {
      const query = `DELETE FROM grad WHERE "gradID"=$1;`;
      const updatedRows = await db.query(query, [gradID]);
      if (updatedRows.rowCount > 0)
        return { message: `Grad successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete grad, its being referenced from table adresa`,
        );
      return new BadRequestException('Error while deleting grad!');
    }
  }

  async getAllPonuda() {
    try {
      const query = `SELECT p."ponudaID", p."datumUnosa", p."datumStampe", p."datumIsteka", p."iznosFransize", p.broj, z.naslov, r."imePrezimeRadnika", k."imePrezimeKlijenta" FROM ponuda p JOIN zahtev z ON p."zahtevID" = z."zahtevID" JOIN radnik r ON p."radnikID" = r."radnikID" JOIN klijent k ON p."klijentID" = k."klijentID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all ponuda');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting ponude');
    }
  }

  async updatePonudaById(ponuda: PonudaRequestDto) {
    try {
      const queryZahtev = `SELECT * FROM zahtev WHERE "naslov"=$1;`;
      const { zahtevID } = (await db.query(queryZahtev, [ponuda.naslov]))
        .rows[0];
      const queryRadnik = `SELECT * FROM radnik WHERE "imePrezimeRadnika"=$1;`;
      const { radnikID } = (
        await db.query(queryRadnik, [ponuda.imePrezimeRadnika])
      ).rows[0];

      const queryKlijent = `SELECT * FROM klijent WHERE "imePrezimeKlijenta"=$1;`;
      const { klijentID } = (
        await db.query(queryKlijent, [ponuda.imePrezimeKlijenta])
      ).rows[0];

      ponuda.imePrezimeKlijenta = ponuda.imePrezimeKlijenta.trim();
      ponuda.imePrezimeRadnika = ponuda.imePrezimeRadnika.trim();

      if (ponuda.ponudaID) {
        const query = `UPDATE ponuda SET "zahtevID"=$1, "radnikID"=$2, "broj"=$3, "datumUnosa"=$4, "datumStampe"=$5, "datumIsteka" = $6, "iznosFransize" = $7 WHERE "ponudaID"=$8;`;
        const updatedRows = await db.query(query, [
          zahtevID,
          radnikID,
          ponuda.broj,
          new Date(ponuda.datumUnosa),
          new Date(ponuda.datumStampe),
          new Date(ponuda.datumIsteka),
          ponuda.iznosFransize,
          ponuda.ponudaID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'ponuda successfully updated.' };
      } else {
        const query = `INSERT INTO ponuda ("zahtevID","radnikID", "klijentID","broj","datumUnosa","datumStampe","datumIsteka","iznosFransize") VALUES($1,$2,$3,$4,$5,$6,$7,$8);`;
        const updatedRows = await db.query(query, [
          zahtevID,
          radnikID,
          klijentID,
          ponuda.broj,
          new Date(ponuda.datumUnosa),
          new Date(ponuda.datumStampe),
          new Date(ponuda.datumIsteka),
          ponuda.iznosFransize,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'ponuda successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving ponuda!');
    }
  }

  async deletePonudaById(ponudaID: Pick<PonudaRequestDto, 'ponudaID'>) {
    try {
      const query = `DELETE FROM ponuda WHERE "ponudaID"=$1;`;
      const updatedRows = await db.query(query, [ponudaID]);
      if (updatedRows.rowCount > 0)
        return { message: `Ponuda successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete ponuda, its being referenced`,
        );
      return new BadRequestException('Error while deleting ponuda!');
    }
  }

  async getAllZahtev() {
    try {
      const query = `SELECT z."zahtevID", z.naslov, z."sadrzaj", z."datumOd", z."datumDo", z.odobren, r."imePrezimeRadnika", k."imePrezimeKlijenta" FROM zahtev z JOIN radnik r ON z."radnikID" = r."radnikID" JOIN klijent k ON z."klijentID" = k."klijentID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all zahtevi');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting zahtevi');
    }
  }

  async updateZahtevById(zahtev: ZahtevRequestDto) {
    try {
      const queryRadnik = `SELECT * FROM radnik WHERE "imePrezimeRadnika"=$1;`;
      const { radnikID } = (
        await db.query(queryRadnik, [zahtev.imePrezimeRadnika])
      ).rows[0];

      const queryKlijent = `SELECT * FROM klijent WHERE "imePrezimeKlijenta"=$1;`;
      const { klijentID } = (
        await db.query(queryKlijent, [zahtev.imePrezimeKlijenta])
      ).rows[0];

      zahtev.imePrezimeKlijenta = zahtev.imePrezimeKlijenta.trim();
      zahtev.imePrezimeRadnika = zahtev.imePrezimeRadnika.trim();
      zahtev.odobren = zahtev.odobren.toLowerCase();

      if (zahtev.zahtevID) {
        const query = `UPDATE zahtev SET "radnikID"=$1, "naslov"=$2, "sadrzaj"=$3, "datumOd" = $4, "datumDo"=$5,"odobren" = $6 WHERE "zahtevID"=$7;`;
        const updatedRows = await db.query(query, [
          radnikID,
          zahtev.naslov,
          zahtev.sadrzaj,
          new Date(zahtev.datumOd),
          new Date(zahtev.datumDo),
          zahtev.odobren == 'odobren' ? true : false,
          zahtev.zahtevID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Zahtev successfully updated.' };
      } else {
        const query = `INSERT INTO zahtev ("radnikID", "klijentID","naslov","sadrzaj","datumOd","datumDo","odobren") VALUES($1,$2,$3,$4,$5,$6,$7);`;
        const updatedRows = await db.query(query, [
          radnikID,
          klijentID,
          zahtev.naslov,
          zahtev.sadrzaj,
          new Date(zahtev.datumOd),
          new Date(zahtev.datumDo),
          zahtev.odobren == 'odobren' ? true : false,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Zahtev successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving zahtev!');
    }
  }

  async deleteZahtevById(zahtevID: Pick<ZahtevRequestDto, 'zahtevID'>) {
    try {
      const query = `DELETE FROM zahtev WHERE "zahtevID"=$1;`;
      const updatedRows = await db.query(query, [zahtevID]);
      if (updatedRows.rowCount > 0)
        return { message: `Zahtev successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete zahtev, its being referenced`,
        );
      return new BadRequestException('Error while deleting zahtev!');
    }
  }

  async getAllVozilo() {
    try {
      const query = `SELECT "registarski_broj", model, marka, (pogon).tip_goriva, (pogon).jacina_motora, kilometraza, "datumistekaregistracije" FROM vozilo;`;
      const db_response = await db.query(query);
      console.log('Successfully got all vozila');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting vozila');
    }
  }

  async insertVozilo(vozilo: VoziloRequestDto) {
    try {
      const query = `INSERT INTO vozilo("registarski_broj", "model", marka, pogon, kilometraza, datumistekaregistracije) VALUES($1,$2,$3,ROW($4,$5),$6,$7);`;
      const updatedRows = await db.query(query, [
        vozilo.registarski_broj,
        vozilo.model,
        vozilo.marka,
        vozilo.tip_goriva,
        vozilo.jacina_motora,
        vozilo.kilometraza,
        new Date(vozilo.datumistekaregistracije),
      ]);
      if (updatedRows.rowCount > 0)
        return { message: 'Vozilo successfully inserted.' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while inserting vozilo!');
    }
  }

  async getVoziloByMarka(marka: string) {
    try {
      const query = `SELECT "registarski_broj", model, marka, (pogon).tip_goriva, (pogon).jacina_motora, kilometraza, "datumistekaregistracije" FROM vozilo WHERE marka=$1;`;
      const db_response = await db.query(query, [marka]);
      console.log('Successfully got searched vozila');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting vozila');
    }
  }
}
