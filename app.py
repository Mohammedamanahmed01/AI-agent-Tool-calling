import streamlit as st
from orchestrator import autonomous_agent

st.title("AI Agent ")

user_input = st.text_input("Ask something:")

if user_input:
    result = autonomous_agent(user_input)
    st.write(result)