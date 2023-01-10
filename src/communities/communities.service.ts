import { CenaRequestDto } from './../dto/request/cena-request.dto';
import { UslugaRequestDto } from './../dto/request/usluga-request.dto';
import { OstecenjeRequestDto } from './../dto/request/ostecenje-request.dto';
import { UgovorRequestDto } from './../dto/request/ugovor-request.dto';
import { RacunRequestDto } from './../dto/request/racun-request.dto';
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
          return { message: 'Ponuda successfully saved.' };
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

  async updateVoziloById(vozilo: VoziloRequestDto) {
    try {
      const query = `SELECT * FROM vozilo WHERE "registarski_broj" = $1;`;
      const db_response = await db.query(query, [vozilo.registarski_broj]);
      let registarski_broj;

      if (db_response.rowCount) {
        registarski_broj = db_response.rows[0].registarski_broj;
      }

      if (registarski_broj) {
        const query = `UPDATE vozilo SET "model"=$1, "marka"=$2, "pogon"=ROW($3,$4), "kilometraza" = $5, "datumistekaregistracije"=$6 WHERE "registarski_broj"=$7;`;
        const updatedRows = await db.query(query, [
          vozilo.model,
          vozilo.marka,
          vozilo.tip_goriva,
          vozilo.jacina_motora,
          vozilo.kilometraza,
          new Date(vozilo.datumistekaregistracije),
          vozilo.registarski_broj,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Vozilo successfully saved.' };
      } else {
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
          return { message: 'Vozilo successfully saved.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving vozilo!');
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

  async deleteVoziloById(
    registarski_broj: Pick<VoziloRequestDto, 'registarski_broj'>,
  ) {
    try {
      const query = `DELETE FROM vozilo WHERE "registarski_broj"=$1;`;
      const updatedRows = await db.query(query, [registarski_broj]);
      if (updatedRows.rowCount > 0)
        return { message: `Vozilo successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete vozilo, its being referenced`,
        );
      return new BadRequestException('Error while deleting vozilo!');
    }
  }

  async getAllRacuni() {
    try {
      const query = `SELECT r."racunID",r."brojRacuna", r."datumIzdavanja", r."datumPrometa", r."datumStampe", r."datumDospeca", r."vrstaPlacanja", rd."imePrezimeRadnika" FROM racun r JOIN radnik rd ON r."radnikID" = rd."radnikID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all racuni');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting racuni');
    }
  }

  async getAllRadnik() {
    try {
      const query = `SELECT * FROM radnik;`;
      const db_response = await db.query(query);
      console.log('Successfully got all radnici');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting radnici');
    }
  }

  async getAllKlijent() {
    try {
      const query = `SELECT * FROM klijent;`;
      const db_response = await db.query(query);
      console.log('Successfully got all klijenti');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting klijenti');
    }
  }

  async updateRacunById(racun: RacunRequestDto) {
    try {
      const queryRadnik = `SELECT * FROM radnik WHERE "imePrezimeRadnika"=$1;`;
      const { radnikID } = (
        await db.query(queryRadnik, [racun.imePrezimeRadnika])
      ).rows[0];

      if (racun.racunID) {
        const query = `UPDATE racun SET "radnikID"=$1, "brojRacuna"=$2, "datumIzdavanja"=$3, "datumPrometa" = $4, "datumStampe"=$5,"datumDospeca" = $6, "vrstaPlacanja"=$7 WHERE "racunID"=$8;`;
        const updatedRows = await db.query(query, [
          radnikID,
          racun.brojRacuna,
          new Date(racun.datumIzdavanja),
          new Date(racun.datumPrometa),
          new Date(racun.datumStampe),
          new Date(racun.datumDospeca),
          racun.vrstaPlacanja,
          racun.racunID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Racun successfully updated.' };
      } else {
        const query = `INSERT INTO racun ("brojRacuna", "datumIzdavanja","datumPrometa","datumStampe","datumDospeca","vrstaPlacanja","radnikID") VALUES($1,$2,$3,$4,$5,$6,$7);`;
        const updatedRows = await db.query(query, [
          racun.brojRacuna,
          new Date(racun.datumIzdavanja),
          new Date(racun.datumPrometa),
          new Date(racun.datumStampe),
          new Date(racun.datumDospeca),
          racun.vrstaPlacanja,
          radnikID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Racun successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving racun!');
    }
  }

  async deleteRacunById(racunID: Pick<RacunRequestDto, 'racunID'>) {
    try {
      const query = `DELETE FROM racun WHERE "racunID"=$1;`;
      const updatedRows = await db.query(query, [racunID]);
      if (updatedRows.rowCount > 0)
        return { message: `Racun successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete racun, its being referenced`,
        );
      return new BadRequestException('Error while deleting racun!');
    }
  }

  async getAllTekuciRacuni() {
    try {
      const query = `SELECT r."racunID",r."brojRacuna", r."datumIzdavanja", r."datumPrometa", r."datumStampe", r."datumDospeca", r."vrstaPlacanja", rd."imePrezimeRadnika" FROM racun_tekuca_godina r JOIN radnik rd ON r."radnikID" = rd."radnikID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all racuni');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting racuni');
    }
  }

  async getAllPrethodniRacuni() {
    try {
      const query = `SELECT r."racunID",r."brojRacuna", r."datumIzdavanja", r."datumPrometa", r."datumStampe", r."datumDospeca", r."vrstaPlacanja", rd."imePrezimeRadnika" FROM racun_prethodna_godina r JOIN radnik rd ON r."radnikID" = rd."radnikID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all racuni');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting racuni');
    }
  }

  async getAllRanijiRacuni() {
    try {
      const query = `SELECT r."racunID",r."brojRacuna", r."datumIzdavanja", r."datumPrometa", r."datumStampe", r."datumDospeca", r."vrstaPlacanja", rd."imePrezimeRadnika" FROM racun_ranije_godine r JOIN radnik rd ON r."radnikID" = rd."radnikID";`;
      const db_response = await db.query(query);
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting racuni');
    }
  }

  async getAllDrzave() {
    try {
      const query = `SELECT * FROM drzava;`;
      const db_response = await db.query(query);
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting drzave');
    }
  }

  async getPonudaByID(ponudaID: number) {
    try {
      const query = `SELECT p."ponudaID", p."datumUnosa", p."datumStampe", p."datumIsteka", p."iznosFransize", p.broj, z.naslov, r."imePrezimeRadnika", k."imePrezimeKlijenta" FROM ponuda p JOIN zahtev z ON p."zahtevID" = z."zahtevID" JOIN radnik r ON p."radnikID" = r."radnikID" JOIN klijent k ON p."klijentID" = k."klijentID" WHERE p."ponudaID" = $1;`;
      const db_response = await db.query(query, [ponudaID]);
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting ponude');
    }
  }

  async getAllRezervacije() {
    try {
      const query = `SELECT * FROM rezervacija;`;
      const db_response = await db.query(query);
      console.log('Successfully got all rezervacije');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting rezervacije');
    }
  }

  async getAllUgovori() {
    try {
      const query = `SELECT u.*, rd."imePrezimeRadnika", r."brojRezervacije" FROM svi_detalji_ugovora u JOIN radnik rd ON u."radnikID" = rd."radnikID" JOIN rezervacija r ON u."rezervacijaID" = r."rezervacijaID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all ugovori');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting ugovori');
    }
  }

  async allBitnijiDeloviUgovora() {
    try {
      const query = `SELECT u."redniBrojUgovora", rd."imePrezimeRadnika", r."brojRezervacije" FROM ugovor u JOIN radnik rd ON u."radnikID" = rd."radnikID" JOIN rezervacija r ON u."rezervacijaID" = r."rezervacijaID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all ugovori bitniji delovi');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException(
        'Error while getting ugovori bitniji delovi',
      );
    }
  }

  async allDetaljiUgovora() {
    try {
      const query = `SELECT * FROM ugovor_detalji;`;
      const db_response = await db.query(query);
      console.log('Successfully got all ugovori detalji');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting ugovori detalji');
    }
  }

  async updateUgovorById(ugovor: UgovorRequestDto) {
    try {
      const queryRadnik = `SELECT * FROM radnik WHERE "imePrezimeRadnika"=$1;`;
      const { radnikID } = (
        await db.query(queryRadnik, [ugovor.imePrezimeRadnika])
      ).rows[0];

      const queryRezervacija = `SELECT * FROM rezervacija WHERE "brojRezervacije"=$1;`;
      const { rezervacijaID } = (
        await db.query(queryRezervacija, [ugovor.brojRezervacije])
      ).rows[0];

      if (ugovor.ugovorID) {
        const query = `UPDATE svi_detalji_ugovora SET "radnikID"=$1, "rezervacijaID"=$2, "datumUnosa"=$3, "datumStampe" = $4, "iznosFransize"=$5,"cenovnik" = $6, "depozit"=$7, "redniBrojUgovora"=$8, "obavestenje"=$9 WHERE "ugovorID"=$10;`;
        const updatedRows = await db.query(query, [
          radnikID,
          rezervacijaID,
          new Date(ugovor.datumUnosa),
          new Date(ugovor.datumStampe),
          ugovor.iznosFransize,
          ugovor.cenovnik,
          ugovor.depozit,
          ugovor.redniBrojUgovora,
          ugovor.obavestenje,
          ugovor.ugovorID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Ugovor successfully updated.' };
      } else {
        const query = `INSERT INTO svi_detalji_ugovora ("redniBrojUgovora", "datumUnosa","datumStampe","iznosFransize","cenovnik", "depozit", "rezervacijaID", "radnikID", "obavestenje") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);`;
        const updatedRows = await db.query(query, [
          ugovor.redniBrojUgovora,
          new Date(ugovor.datumUnosa),
          new Date(ugovor.datumStampe),
          ugovor.iznosFransize,
          ugovor.cenovnik,
          ugovor.depozit,
          rezervacijaID,
          radnikID,
          ugovor.obavestenje,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Ugovor successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving ugovor!');
    }
  }

  async deleteUgovorById(ugovorID: Pick<UgovorRequestDto, 'ugovorID'>) {
    try {
      const query = `DELETE FROM svi_detalji_ugovora WHERE "ugovorID"=$1;`;
      await db.query(query, [ugovorID]);
      return { message: `Ugovor successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete ugovor, its being referenced`,
        );
      return new BadRequestException('Error while deleting ugovor!');
    }
  }

  async getAllOstecenja() {
    try {
      const query = `SELECT o.*, r."imePrezimeRadnika", u."redniBrojUgovora" FROM ostecenja o JOIN radnik r ON o."radnikID" = r."radnikID" JOIN ugovor u ON o."ugovorID" = u."ugovorID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all ostecenja');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting ostecenja');
    }
  }

  async updateOstecenjeById(ostecenje: OstecenjeRequestDto) {
    try {
      const queryRadnik = `SELECT * FROM radnik WHERE "imePrezimeRadnika"=$1;`;
      const { radnikID } = (
        await db.query(queryRadnik, [ostecenje.imePrezimeRadnika])
      ).rows[0];

      const queryUgovor = `SELECT * FROM ugovor WHERE "redniBrojUgovora"=$1;`;
      const { ugovorID } = (
        await db.query(queryUgovor, [ostecenje.redniBrojUgovora])
      ).rows[0];

      if (ostecenje.ostecenjaID) {
        const query = `UPDATE ostecenja SET "obavestenje"=$1, "tipOstecenja"=$2, "radnikID"=$3, "ugovorID" = $4 WHERE "ostecenjaID"=$5;`;
        const updatedRows = await db.query(query, [
          ostecenje.obavestenje,
          ostecenje.tipOstecenja,
          radnikID,
          ugovorID,
          ostecenje.ostecenjaID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Ostecenje successfully updated.' };
      } else {
        const query = `INSERT INTO ostecenja ("obavestenje", "tipOstecenja","radnikID","ugovorID") VALUES($1,$2,$3,$4);`;
        const updatedRows = await db.query(query, [
          ostecenje.obavestenje,
          ostecenje.tipOstecenja,
          radnikID,
          ugovorID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Ostecenje successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving ostecenje!');
    }
  }

  async getAllUsluge() {
    try {
      const query = `SELECT * FROM vrsta_usluge;`;
      const db_response = await db.query(query);
      console.log('Successfully got all usluge');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting usluge');
    }
  }

  async getAllCene() {
    try {
      const query = `SELECT c.*, v."naziv" FROM cena_usluge c JOIN vrsta_usluge v ON c."vrstaUslugeID" = v."vrstaUslugeID";`;
      const db_response = await db.query(query);
      console.log('Successfully got all cene');
      return db_response.rows;
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while getting cene');
    }
  }

  async updateUsluguById(usluga: UslugaRequestDto) {
    try {
      if (usluga.vrstaUslugeID) {
        const query = `UPDATE vrsta_usluge SET "naziv"=$1 WHERE "vrstaUslugeID"=$2;`;
        const updatedRows = await db.query(query, [
          usluga.naziv,
          usluga.vrstaUslugeID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Usluga successfully updated.' };
      } else {
        const query = `INSERT INTO vrsta_usluge ("naziv") VALUES($1);`;
        const updatedRows = await db.query(query, [usluga.naziv]);
        if (updatedRows.rowCount > 0)
          return { message: 'Usluga successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving uslugu!');
    }
  }

  async deleteUsluguById(
    vrstaUslugeID: Pick<UslugaRequestDto, 'vrstaUslugeID'>,
  ) {
    try {
      const query = `DELETE FROM vrsta_usluge WHERE "vrstaUslugeID"=$1;`;
      await db.query(query, [vrstaUslugeID]);
      return { message: `Usluga successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete usluga, its being referenced`,
        );
      return new BadRequestException('Error while deleting usluga!');
    }
  }

  async updateCenuById(cena: CenaRequestDto) {
    try {
      const queryUsluga = `SELECT * FROM vrsta_usluge WHERE "naziv"=$1;`;
      const { vrstaUslugeID } = (await db.query(queryUsluga, [cena.naziv]))
        .rows[0];

      if (cena.cenaUslugeID) {
        const query = `UPDATE cena_usluge SET "vrstaUslugeID" = $1, iznos=$2, "datumOd"=$3 WHERE "cenaUslugeID"=$4;`;
        const updatedRows = await db.query(query, [
          vrstaUslugeID,
          cena.iznos,
          new Date(cena.datumOd),
          cena.cenaUslugeID,
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Cena successfully updated.' };
      } else {
        const query = `INSERT INTO cena_usluge ("vrstaUslugeID","iznos","datumOd") VALUES($1,$2,$3);`;
        const updatedRows = await db.query(query, [
          vrstaUslugeID,
          cena.iznos,
          new Date(cena.datumOd),
        ]);
        if (updatedRows.rowCount > 0)
          return { message: 'Cena successfully inserted.' };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while saving cena!');
    }
  }

  async deleteCenuById(cenaUslugeID: Pick<CenaRequestDto, 'cenaUslugeID'>) {
    try {
      const query = `DELETE FROM cena_usluge WHERE "cenaUslugeID"=$1;`;
      await db.query(query, [cenaUslugeID]);
      return { message: `Cena successfully deleted` };
    } catch (error) {
      console.log(error);
      if (error.code === '23503')
        return new BadRequestException(
          `Can't delete cena, its being referenced`,
        );
      return new BadRequestException('Error while deleting cena!');
    }
  }
}
