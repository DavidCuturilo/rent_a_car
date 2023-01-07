import { GradRequestDto } from './../dto/request/grad-request.dto';
import { AddressRequestDto } from './../dto/request/address-request.dto';
import { db } from './../db/connection';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CommunitiesService {
  async getAllAddress() {
    try {
      const query = `SELECT * FROM adresa;`;
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
      const { gradID, drzavaID } = (
        await db.query(queryGrad, [adresa.nazivGrada])
      ).rows[0];
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
      const query = `UPDATE adresa SET ulica=$1, broj=$2 WHERE "adresaID"=$3;`;
      const updatedRows = await db.query(query, [
        adresa.ulica,
        adresa.broj,
        adresa.adresaID,
      ]);
      if (updatedRows.rowCount > 0)
        return { message: 'Address successfully updated.' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while updating address!');
    }
  }

  async deleteAddressById(adresa: Omit<AddressRequestDto, 'ulica' | 'broj'>) {
    try {
      const query = `DELETE FROM adresa WHERE "adresaID"=$1;`;
      const updatedRows = await db.query(query, [adresa.adresaID]);
      if (updatedRows.rowCount > 0)
        return { message: 'Address successfully deleted' };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while deleting address!');
    }
  }

  async getAllGrad() {
    try {
      const query = `SELECT * FROM grad;`;
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

  async deleteGradById(grad: GradRequestDto) {
    try {
      const query = `DELETE FROM grad WHERE "gradID"=$1;`;
      const updatedRows = await db.query(query, [grad.gradID]);
      if (updatedRows.rowCount > 0)
        return { message: `Grad ${grad.nazivGrada} successfully deleted` };
    } catch (error) {
      console.log(error);
      return new BadRequestException('Error while deleting grad!');
    }
  }
}
