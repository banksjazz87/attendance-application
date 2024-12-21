
/**
 * Used to export data to a csv file
 */
import fs from "fs";

export class ExportClass {
    data: object[];
    table: string;
    outputFile: string;

    constructor(data: object[], table: string, outputFile: string) {
        this.data = data;
        this.table = table;
        this.outputFile = outputFile;
    }

    /**
     * 
     * @returns String
     * @description used to create the body of the CSV
     */
    getBody(): string {
        //Create an array of our needed data
        const arrayOfData: string[] = this.data.map((x: Object, y: number): string => {
            let csv: string = '';
            for (const value of Object.values(x)) {
                csv += `${value},`;
            }
            //Return everything but the trailing comma
            return csv.substring(0, csv.length - 1).trim() + '\n';
        });

        //Create a string of the data
        const csvString: string = arrayOfData.join('');
        return csvString;
    }
    

    /**
     * 
     * @returns String
     * @description used to create the headers for our CSV
     */
    getHeaders(): string{
        //Construct our headers, pull the headers by extracting the keys of the first item.
        const headersArrray: string[] = Object.keys(this.data[0]);
        const headersText: string[] = headersArrray.map((x: string, y: number): string => {
            return `${x},`;
        });

        //Convert to string and remove the trailing comma
        const headersString: string = headersText.join('').trim();
        return headersString.substring(0, headersString.length -1);
    }


    /**
     * 
     * @returns string
     * @description return the full CSV doc
     */
    getFullDoc(): string {
        return `${this.table} \n ${this.getHeaders()} \n ${this.getBody()}`
    }


    /**
     * @returns void
     * @description writes our file to the pre-defined output file
     */
    writeFile(): void {
        const content = this.getFullDoc();
        fs.writeFile(this.outputFile, content, (err): void => {
            err ? console.log('An error occurred while creating the CSV ', err) : console.log(`${this.outputFile} has been created successfully.`);
        })
    }


}