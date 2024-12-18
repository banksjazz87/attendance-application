
/**
 * Used to export data to a csv file
 */

export class ExportClass {
    data: object[];
    table: string;

    constructor(data: object[], table: string) {
        this.data = data;
        this.table = table;
    }

    getBody(): string {
        const arrayOfData: string[] = this.data.map((x: Object, y: number): string => {
            let csv: string = '';
            for (const value of Object.values(x)) {
                csv += `"${value}",`;
            }
            return csv + '\r\n';
        });

        //Create a string of the data
        const csvString: string = arrayOfData.join(' ');
        return csvString;
    }
    
    getHeaders(): string{
        const headersArrray: string[] = Object.keys(this.data[0]);
        const headersText: string[] = headersArrray.map((x: string, y: number): string => {
            return `"${x}", `;
        });

        const headersString: string = headersText.join(' ');
        return headersString;
    }

    getFullDoc(): string {
        return `${this.table} \r\n ${this.getHeaders()} \r\n ${this.getBody()}`
    }
}