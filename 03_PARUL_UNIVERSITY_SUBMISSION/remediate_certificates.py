import docx
from docx.shared import Pt, Inches
import win32com.client
import os

input_path = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\02_CERTIFICATES\PROJECT_CERTIFICATES.docx")
output_docx = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\02_CERTIFICATES\PROJECT_CERTIFICATES_FINAL_QC.docx")
output_pdf = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\02_CERTIFICATES\PROJECT_CERTIFICATES_FINAL_QC.pdf")

doc = docx.Document(input_path)

# Adjust section margins to 0.75 inches to allow comfortable 1-page fit per certificate
for section in doc.sections:
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

# Optimize spacing across all paragraphs in the certificates document
for p in doc.paragraphs:
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.05
    
    # Trim excess blank lines in signature blocks
    if "Date: ____________________" in p.text and "___________________________________" in p.text:
        # replace 3+ newlines with 2 newlines
        p.text = p.text.replace("\n\n\n\n", "\n\n").replace("\n\n\n", "\n\n")

# Specifically check Certificate 5 (Student Declaration), 6 (Undertaking), 10 (Acknowledgement)
# Remove empty paragraphs preceding signature blocks
for i, p in enumerate(doc.paragraphs):
    if p.text.strip() == "" and i + 1 < len(doc.paragraphs) and "Date: ____________________" in doc.paragraphs[i+1].text:
        # Clear or collapse empty paragraph
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)

# Also ensure table spacing is compact
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(1)
                p.paragraph_format.line_spacing = 1.0

doc.save(output_docx)
print(f"Saved optimized certificates DOCX: {output_docx}")

# Compile to PDF using Word COM
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
try:
    wdoc = word.Documents.Open(output_docx)
    wdoc.SaveAs(output_pdf, FileFormat=17)
    wdoc.Close()
    print(f"Successfully compiled PDF: {output_pdf}")
finally:
    word.Quit()

import pypdf
reader = pypdf.PdfReader(output_pdf)
print(f"Total pages in PROJECT_CERTIFICATES_FINAL_QC.pdf: {len(reader.pages)}")
for idx, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    first = txt.split('\n')[0] if txt else "EMPTY"
    print(f"Page {idx+1} ({len(txt)} chars): {first[:50]}")

