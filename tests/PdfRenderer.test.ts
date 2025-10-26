import { PdfRenderer } from '../src/PdfRenderer';
import { Letter } from '../src/Letter';
import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert';
import pdfMake from 'pdfmake/build/pdfmake';

describe('PdfRenderer', () => {
    it('able to generate a pdf and return its buffer', async () => {
        const letter = new Letter({
            sender_address: ['Jane Doe', '123 Some Lane', '12345 Some City', 'Some Country'],
            recipient_address: ['John Doe', '667 One Street', '98765 Another City', 'A Country'],
            information_block: 'A block of information',
            subject: 'a'.repeat(1000),
            content: 'Content of my letter',
            signature: { type: 'text', name: 'Name' },
        });

        const renderer = new PdfRenderer(letter);

        const mockBuffer = Buffer.from('test');
        const mockedBuffer = mock.fn((callback: (buffer: Buffer) => void) => {
            callback(mockBuffer);
        });

        const mockedCreatePdf = mock.method(pdfMake, 'createPdf', () => ({
            getBuffer: mockedBuffer,
        }));

        const buffer = await renderer.getBuffer();

        assert.strictEqual(mockedCreatePdf.mock.callCount(), 1);
        assert.strictEqual(buffer, mockBuffer);
    });
});
