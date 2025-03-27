Once you’ve provided the documentation, clearly describe to Claude what kind of server you want to build. Be specific about:

What resources your server will expose
What tools it will provide
Any prompts it should offer
What external systems it needs to interact with
For example:

Copy
Build an MCP server that:

- Connects to my company's PostgreSQL database
- Exposes table schemas as resources
- Provides tools for running read-only SQL queries
- Includes prompts for common data analysis tasks

Working with Claude
When working with Claude on MCP servers:

Start with the core functionality first, then iterate to add more features
Ask Claude to explain any parts of the code you don’t understand
Request modifications or improvements as needed
Have Claude help you test the server and handle edge cases
Claude can help implement all the key MCP features:

Resource management and exposure
Tool definitions and implementations
Prompt templates and handlers
Error handling and logging
Connection and transport setup
​
Best practices
When building MCP servers with Claude:

Break down complex servers into smaller pieces
Test each component thoroughly before moving on
Keep security in mind - validate inputs and limit access appropriately
Document your code well for future maintenance
Follow MCP protocol specifications carefully
​
