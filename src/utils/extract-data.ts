import * as AWS from 'aws-sdk';
import { promises as fs} from 'fs';

const textract = new AWS.Textract();

const main = async () => {
    try {
        //read the image
        const buf = await fs.readFile('./image.jpg');
        //send to aws
        const res = await textract.detectDocumentText({Document: {Bytes: buf}}).promise();
        //parse the result
        if (res.Blocks) {
            console.log(res.Blocks.filter(i => i.BlockType === 'LINE').map(i => i.Text).join('\n'));
        } else {
            console.error('No blocks found in the response');
        }
    } catch (err) {
        console.error(err);
    }
}

export default main