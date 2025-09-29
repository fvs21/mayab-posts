from typing import List, Dict
from pydantic import ValidationError

def format_validation_error(e: ValidationError) -> List[Dict[str, str]]:
    errors = []

    for error in e.errors():
        error_detail = {
            "input": ".".join(str(loc) for loc in error['loc']),
            "message": error['msg'],
            "type": error['type']
        }
        errors.append(error_detail)

    return errors