import io
import csv
import json
import logging
from typing import Optional

logger = logging.getLogger(__name__)


async def extract_text_from_file(filename: str, content: bytes) -> str:
    """
    Extract text content from uploaded files.
    Supports: PDF, CSV, TXT, JSON
    """
    ext = filename.lower().split(".")[-1] if "." in filename else ""

    try:
        if ext == "pdf":
            return _extract_from_pdf(content)
        elif ext == "csv":
            return _extract_from_csv(content)
        elif ext == "json":
            return _extract_from_json(content)
        elif ext in ("txt", "md", "text"):
            return _extract_from_text(content)
        else:
            # Try UTF-8 text as fallback
            return content.decode("utf-8", errors="replace")
    except Exception as e:
        logger.error(f"File processing error for {filename}: {e}")
        raise ValueError(f"Could not process file '{filename}': {str(e)}")


def _extract_from_pdf(content: bytes) -> str:
    """Extract text from PDF using PyMuPDF."""
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(stream=content, filetype="pdf")
        pages_text = []
        for page_num, page in enumerate(doc):
            text = page.get_text("text")
            if text.strip():
                pages_text.append(f"[Page {page_num + 1}]\n{text.strip()}")
        doc.close()
        full_text = "\n\n".join(pages_text)
        if not full_text.strip():
            return "[PDF contains no extractable text - may be image-based]"
        return full_text[:50000]  # Limit to 50k chars
    except ImportError:
        return "[PyMuPDF not installed - PDF parsing unavailable]"


def _extract_from_csv(content: bytes) -> str:
    """Extract and format CSV data as readable text."""
    try:
        text = content.decode("utf-8", errors="replace")
        reader = csv.DictReader(io.StringIO(text))
        rows = list(reader)

        if not rows:
            return "[Empty CSV file]"

        headers = list(rows[0].keys())
        output_parts = [f"CSV Data ({len(rows)} records):"]
        output_parts.append(f"Columns: {', '.join(headers)}")
        output_parts.append("")

        # Summary stats for numeric columns
        numeric_cols = {}
        for col in headers:
            values = []
            for row in rows:
                try:
                    values.append(float(row[col]))
                except (ValueError, TypeError):
                    pass
            if len(values) > len(rows) * 0.5:  # Majority numeric
                numeric_cols[col] = values

        if numeric_cols:
            output_parts.append("Numeric Column Statistics:")
            for col, values in numeric_cols.items():
                avg = sum(values) / len(values)
                output_parts.append(
                    f"  {col}: min={min(values):.2f}, max={max(values):.2f}, avg={avg:.2f}, count={len(values)}"
                )
            output_parts.append("")

        # Sample rows (first 100)
        output_parts.append("Sample Data (first 100 rows):")
        for i, row in enumerate(rows[:100]):
            row_text = ", ".join(f"{k}: {v}" for k, v in row.items())
            output_parts.append(f"  Row {i+1}: {row_text}")

        return "\n".join(output_parts)
    except Exception as e:
        return f"[CSV parsing error: {e}]"


def _extract_from_json(content: bytes) -> str:
    """Extract and format JSON data as readable text."""
    try:
        data = json.loads(content.decode("utf-8", errors="replace"))
        return f"JSON Data:\n{json.dumps(data, indent=2)}"[:50000]
    except json.JSONDecodeError as e:
        return f"[JSON parsing error: {e}]"


def _extract_from_text(content: bytes) -> str:
    """Extract plain text content."""
    text = content.decode("utf-8", errors="replace")
    return text[:50000]  # Limit to 50k chars
