# Nexus Yahya - Sistem Mimarisi ve Gereksinimler

## 1. Proje Gereksinimler ve Sistem Mimarisi

### 📋 Proje Gereksinimler

#### Donanım Gereksinimleri (Training)
- **GPU**: NVIDIA A100/H100 (80GB VRAM) veya RTX 4090 (24GB)
- **CPU**: Intel Xeon / AMD EPYC (64+ cores)
- **RAM**: 256GB+ (model + data loading)
- **Storage**: 10TB+ (dataset + models + checkpoints)
- **Network**: 10Gbps+ (distributed training)

#### Yazılım Stack

**Model Training & Inference:**
- Python 3.10+
- PyTorch 2.0+
- Transformers (Hugging Face)
- vLLM / FastAPI (Inference)
- PEFT (Parameter-Efficient Fine-Tuning)
- TRL (Transformer Reinforcement Learning)

**Vektör Database:**
- pgvector (PostgreSQL)
- Pinecone / Weaviate
- Qdrant

**Backend:**
- FastAPI / Flask
- PostgreSQL 14+
- Redis (Caching)
- Celery (Task Queue)

**Frontend:**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn UI

**Infrastructure:**
- Docker / Kubernetes
- NVIDIA Container Toolkit
- Ray Cluster (Distributed Training)
- Prometheus + Grafana (Monitoring)

---

## 2. Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXUS YAHYA PLATFORM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                           │
├──────────────────────────────────────────────────────────────────┤
│  Next.js Web App (React) → Shadcn UI → Tailwind CSS              │
│  - Code Editor (Monaco)                                           │
│  - Live Preview (Sandbox)                                         │
│  - Chat Interface                                                 │
│  - Project Manager                                                │
└──────────────────────────────────────────────────────────────────┘
                                ↓
┌──────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                              │
├──────────────────────────────────────────────────────────────────┤
│  FastAPI / Express Gateway                                        │
│  - Authentication (JWT)                                           │
│  - Rate Limiting                                                  │
│  - Request Routing                                                │
│  - Logging & Monitoring                                           │
└──────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Auth Service    │  │ Inference API   │  │ Vector DB API   │
│                 │  │                 │  │                 │
│ NextAuth.js     │  │ vLLM Server     │  │ pgvector        │
│ JWT             │  │ Model Loading   │  │ Embedding Gen   │
│ OAuth2          │  │ Streaming       │  │ Vector Search   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│                   MODEL INFERENCE LAYER                           │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ Base Model     │  │ Fine-Tuned     │  │ Embedding      │     │
│  │ (GPT-2/LLaMA)  │  │ Model (LoRA)   │  │ Model          │     │
│  │                │  │ (Code Gen)     │  │                │     │
│  │ - Quantized    │  │ - RLHF Aligned │  │ - 384/768-dim  │     │
│  │ - safetensors  │  │ - DPO Tuned    │  │ - Normalized   │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                   │
│  vLLM (High-throughput inference)                                │
│  - Continuous Batching                                           │
│  - PagedAttention                                                │
│  - Multi-GPU Support                                             │
└──────────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│                   TRAINING PIPELINE LAYER                         │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Data Collection & Preprocessing                       │   │
│  │    - Web Scraping (GitHub, CodePen)                      │   │
│  │    - Dataset Deduplication                               │   │
│  │    - Tokenization (BPE / WordPiece)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 2. Pre-training (Causal Language Modeling)               │   │
│  │    - Multi-GPU / Multi-Node Training                     │   │
│  │    - Gradient Accumulation                               │   │
│  │    - Mixed Precision (FP16/BF16)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 3. Fine-tuning (Supervised Fine-Tuning)                  │   │
│  │    - LoRA / QLoRA Adapters                               │   │
│  │    - Instruction Following                               │   │
│  │    - Code Generation Tasks                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 4. RLHF / DPO Alignment                                  │   │
│  │    - Preference Optimization                             │   │
│  │    - Human Feedback Integration                          │   │
│  │    - Safety Constraints                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                      │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ PostgreSQL   │  │ pgvector DB  │  │ Redis Cache  │           │
│  │              │  │              │  │              │           │
│  │ - Users      │  │ - Embeddings │  │ - Sessions   │           │
│  │ - Projects   │  │ - Vectors    │  │ - Tokens     │           │
│  │ - API Keys   │  │ - Similarity │  │ - Datasets   │           │
│  │ - Audit Log  │  │ - Search     │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────────────────────┐             │
│  │ Object Store │  │ Training Data Lake            │             │
│  │              │  │                               │             │
│  │ - Models     │  │ - Raw Datasets (TB)           │             │
│  │ - Checkpoints│  │ - Tokenized Data              │             │
│  │ - Artifacts  │  │ - Processed Examples          │             │
│  └──────────────┘  └──────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────┘

```

---

## 3. Veri Flow Mimarisi

```
User Input (Natural Language)
         ↓
    Embedding Layer (768-dim)
         ↓
    Vector Search (pgvector)
         ↓
    Retrieve Relevant Context (RAG)
         ↓
    Prompt Engineering
         ↓
    Fine-tuned Model (vLLM)
         ↓
    Code Generation Output
         ↓
    Syntax Validation
         ↓
    Live Preview / Export
```

---

## 4. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Frontend Namespace                          │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐     │   │
│  │  │ Next.js Pod (x3)    │    │ Nginx Ingress       │     │   │
│  │  │ - Auto-scaling      │    │ - Load Balancing    │     │   │
│  │  │ - Health Checks     │    │ - SSL/TLS           │     │   │
│  │  └─────────────────────┘    └─────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Namespace                               │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐     │   │
│  │  │ FastAPI Pod (x5)    │    │ Auth Service        │     │   │
│  │  │ - API Gateway       │    │ - JWT Validator     │     │   │
│  │  │ - Rate Limiting     │    │ - Session Manager   │     │   │
│  │  └─────────────────────┘    └─────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ML Inference Namespace                       │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐     │   │
│  │  │ vLLM Pod (GPU x8)   │    │ Embedding Service   │     │   │
│  │  │ - Model Serving     │    │ - Vector Generation │     │   │
│  │  │ - Streaming         │    │ - Batch Processing  │     │   │
│  │  └─────────────────────┘    └─────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Database Namespace                           │   │
│  │  ┌──────────────────┐    ┌──────────────────┐           │   │
│  │  │ PostgreSQL       │    │ pgvector Service │           │   │
│  │  │ StatefulSet      │    │ Vector Index     │           │   │
│  │  └──────────────────┘    └──────────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Cache & Queue Namespace                      │   │
│  │  ┌──────────────────┐    ┌──────────────────┐           │   │
│  │  │ Redis Cluster    │    │ Celery Workers   │           │   │
│  │  │ - Session Cache  │    │ - Background Job │           │   │
│  │  │ - Rate Limiting  │    │ - Training Task  │           │   │
│  │  └──────────────────┘    └──────────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Persistent Volumes:
  - PostgreSQL Data (100GB+)
  - Model Storage (500GB+)
  - Training Logs (50GB+)

External Services:
  - GitHub Actions (CI/CD)
  - Vercel (Frontend CDN)
  - S3 / GCS (Object Storage)
  - Monitoring (Prometheus + Grafana)
```

---

## 5. Veri Pipeline Detayı

### 5.1 Data Collection Sources
- **GitHub Repositories**: Public code datasets (CodeSearchNet, GitHub Copilot data)
- **CodePen / CodeSandbox**: UI/CSS code examples
- **Stack Overflow**: Q&A pairs with code
- **Documentation**: Framework docs (React, Next.js, etc.)
- **Synthetic Data**: Generated code + descriptions

### 5.2 Data Processing Flow
```
Raw Data (TB)
    ↓
[Deduplication] - Remove similar examples
    ↓
[Cleaning] - Remove malicious/invalid code
    ↓
[Filtering] - Language/size constraints
    ↓
[Tokenization] - Convert to token IDs
    ↓
[Formatting] - Instruction + Code template
    ↓
[Splitting] - Train/Val/Test (80/10/10)
    ↓
[Caching] - Store in HDF5/Parquet
```

### 5.3 Model Architecture Tiers

**Tier 1: Small Model (1.3B)**
- 12 layers, 768 hidden size
- ~1.3B parameters
- Fast inference, edge deployment
- Fine-tuning friendly

**Tier 2: Medium Model (7B)**
- 32 layers, 4096 hidden size
- ~7B parameters
- Balanced quality/speed
- Primary for production

**Tier 3: Large Model (70B)**
- 80 layers, 8192 hidden size
- ~70B parameters
- High quality code generation
- High-end inference clusters

---

## 6. Training Configuration

### Pre-training
```
Epochs: 3
Batch Size: 256 (global)
Learning Rate: 2e-4
Warmup Steps: 10k
Max Seq Length: 2048
Optimizer: AdamW
LR Scheduler: Cosine Annealing
Mixed Precision: BF16
```

### Fine-tuning
```
Epochs: 5
Batch Size: 64
Learning Rate: 5e-5
LoRA Rank: 64
LoRA Alpha: 16
Max Seq Length: 1024
Packing: True
```

### RLHF/DPO
```
Method: Direct Preference Optimization
Beta: 0.1
Num Epochs: 2
Batch Size: 32
Learning Rate: 1e-5
```

---

## 7. Model Serving Strategy

- **vLLM**: High-throughput inference with PagedAttention
- **Quantization**: 4-bit (GPTQ) / 8-bit (INT8) untuk memory efficiency
- **LoRA Runtime Loading**: Swap adapters without GPU recompilation
- **Batch Processing**: Dynamic batching for throughput
- **Caching**: KV-cache optimization

---

## 8. Security & Compliance

- **API Security**: Rate limiting, JWT auth, API key rotation
- **Data Privacy**: Encryption at rest/transit, PII redaction
- **Code Safety**: Static analysis, sandbox execution
- **Model Safety**: Prompt injection detection, output filtering
- **Audit Logging**: All API calls, model generations logged

---

## Timeline & Milestones

| Phase | Duration | Key Tasks | Status |
|-------|----------|-----------|--------|
| 1. Setup | Week 1-2 | Infrastructure, Data prep | 🔄 |
| 2. Pre-train | Week 3-6 | Model training | 📋 |
| 3. Fine-tune | Week 7-8 | SFT + LoRA | 📋 |
| 4. RLHF | Week 9-10 | DPO alignment | 📋 |
| 5. Inference | Week 11-12 | vLLM deployment | 📋 |
| 6. Frontend | Week 13-14 | UI development | 📋 |
| 7. Testing | Week 15-16 | QA + optimization | 📋 |
| 8. Launch | Week 17 | Production release | 📋 |
