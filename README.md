# Organization Management System (OMS)

A centralized web application for managing software deployments across government organizations such as High Courts, State Governments, Universities, PSUs, and other institutions.

The system allows administrators to manage organizations, projects, project variants, servers, deployment details, and generate standardized VM naming codes. It also provides role-based access control and audit logging to ensure secure and traceable operations.

## Tech Stack

**Frontend**

* React.js
* TypeScript

**Backend**

* Python
* FastAPI
* asyncpg (Raw SQL)

**Database**

* PostgreSQL

## Repository Structure

```text
oms/
├── frontend/      # React application
├── backend/       # FastAPI backend
├── database/      # SQL schema, migrations and seed data
├── docs/          # Project documentation
└── operations/    # Deployment and utility scripts
```

## Features

* Region, State and Customer Management
* Project & Project Variant Management
* Server Inventory Management
* VM Code Generation
* User Authentication & Authorization
* Audit Logging

## Status

🚧 Currently under development.

