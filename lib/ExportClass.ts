
/**
 * Used to export data to a csv file
 */

export class ExportClass {
    data: object[];
    outPutFile: string;

    constructor(data: object[], outPutFile: string) {
        this.data = data;
        this.outPutFile = outPutFile;
    }

    createCSV(): string {
        const arrayOfData: string[] = this.data.map((x: Object, y: number): string => {
            let csv: string = '';
            for (const value of Object.values(x)) {
                csv += `"${value}",`;
            }
            return csv + '\r\n';
        });

        //Create a string of the data
        const csvString = arrayOfData.join(' ');
        return csvString;
    }
    
}