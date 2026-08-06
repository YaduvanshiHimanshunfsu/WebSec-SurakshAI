import io
from flask import render_template
from xhtml2pdf import pisa

def generate_pdf(scan, target, findings, score_data):
    """
    Generates a PDF from an HTML template using xhtml2pdf.
    """
    # Render HTML template for PDF
    html = render_template('pdf_report.html', scan=scan, target=target, findings=findings, score_data=score_data)
    
    # Create PDF
    result = io.BytesIO()
    pdf = pisa.pisaDocument(io.BytesIO(html.encode("utf-8")), result)
    
    if not pdf.err:
        return result.getvalue()
    return None
