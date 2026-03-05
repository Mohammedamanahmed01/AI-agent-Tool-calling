import math


# ======================
# 🧮 Math Solver Tool
# ======================
def math_solver(expression):
    try:
        # WARNING: only for local safe dev use
        result = eval(expression, {"__builtins__": None}, math.__dict__)
        return f"Result: {result}"
    except Exception as e:
        return f"Math error: {str(e)}"


# ======================
# 🧑‍💻 Python Code Executor
# ======================
def python_executor(code):
    try:
        local_scope = {}
        exec(code, {"__builtins__": {}}, local_scope)
        return f"Execution finished.\nVariables: {local_scope}"
    except Exception as e:
        return f"Execution error: {str(e)}"