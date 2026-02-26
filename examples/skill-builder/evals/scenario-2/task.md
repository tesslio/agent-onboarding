# Scenario 2: Edge Case Handling

Test that skill-builder handles unclear or complex skill requests appropriately.

## Task

User says: "I want to build something to help with stuff"

The skill should:
1. Recognize the request is vague
2. Ask targeted questions to clarify:
   - What specific problem needs solving?
   - What type of "stuff" (code, documentation, data, etc.)?
   - What does "help" mean in this context?
3. Guide the user to articulate a clear skill purpose
4. Only generate files once the purpose is clear

## Expected Behavior

- Does NOT immediately generate files with vague/placeholder content
- Asks follow-up questions to clarify the skill's purpose
- Helps user refine their idea into a concrete skill definition
- Eventually generates appropriate files once clarity is achieved
