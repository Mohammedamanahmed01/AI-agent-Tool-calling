import json
from agents import ask_llm
from tools import math_solver, python_executor


AVAILABLE_TOOLS = {
    "math_solver": math_solver,
    "python_executor": python_executor
}


def autonomous_agent(task):

    system_prompt = """
    You are an autonomous AI agent.

    You have access to these tools:

    1. math_solver(expression: str)
    2. python_executor(code: str)

    If the user asks a math problem, use math_solver.
    If the user asks for coding execution, use python_executor.

    If a tool is needed, respond ONLY in this JSON format:

    {
      "tool": "tool_name",
      "arguments": {"param": "value"}
    }

    If no tool is needed, respond normally.
    """

    response = ask_llm(system_prompt, task)

    # Try to parse tool call
    try:
        tool_call = json.loads(response)

        tool_name = tool_call["tool"]
        arguments = tool_call["arguments"]

        if tool_name in AVAILABLE_TOOLS:
            tool_result = AVAILABLE_TOOLS[tool_name](**arguments)

            # Send result back to LLM
            final_response = ask_llm(
                "You used a tool. Provide the final answer clearly to the user.",
                f"Tool result:\n{tool_result}\n\nOriginal task:\n{task}"
            )

            return final_response

    except:
        return response

    return response