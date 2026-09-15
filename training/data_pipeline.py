"""
Nexus Yahya - Veri Hazırlama ve İşleme Pipeline
Şirket: Yahya Almaz Teknoloji
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import hashlib

import datasets
from datasets import Dataset, DatasetDict, load_dataset
import tokenizers
from tokenizers import Tokenizer, models, normalizers, pre_tokenizers, processors
import numpy as np
from tqdm import tqdm

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== DATA CLASSES ====================

@dataclass
class DataConfig:
    """Veri işleme konfigürasyonu"""
    raw_data_dir: str = "data/raw"
    processed_data_dir: str = "data/processed"
    tokenized_data_dir: str = "data/tokenized"
    
    max_seq_length: int = 2048
    min_seq_length: int = 10
    
    train_split: float = 0.8
    val_split: float = 0.1
    test_split: float = 0.1
    
    vocab_size: int = 50257
    encoding: str = "utf-8"
    
    dedup_threshold: float = 0.95  # Benzerlik eşiği
    
    @property
    def all_dirs(self) -> List[str]:
        return [self.raw_data_dir, self.processed_data_dir, self.tokenized_data_dir]


@dataclass
class CodeExample:
    """Kod örneği veri sınıfı"""
    id: str
    language: str
    code: str
    description: str
    source: str
    tokens: List[int] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


# ==================== DATA COLLECTION ====================

class DataCollector:
    """Çeşitli kaynaklardan veri toplayıcı"""
    
    def __init__(self, config: DataConfig):
        self.config = config
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Gerekli dizinleri oluştur"""
        for dir_path in self.config.all_dirs:
            Path(dir_path).mkdir(parents=True, exist_ok=True)
            logger.info(f"✓ Directory created/verified: {dir_path}")
    
    def collect_from_huggingface(self, dataset_name: str) -> Dataset:
        """Hugging Face'ten dataset yükle"""
        logger.info(f"📥 Loading dataset from Hugging Face: {dataset_name}")
        try:
            dataset = load_dataset(dataset_name, split='train', streaming=True)
            logger.info(f"✓ Loaded {dataset_name}")
            return dataset
        except Exception as e:
            logger.error(f"✗ Error loading {dataset_name}: {e}")
            return None
    
    def collect_github_dataset(self) -> List[CodeExample]:
        """GitHub veri seti topla (CodeSearchNet benzeri)"""
        logger.info("📥 Collecting GitHub Code Dataset...")
        
        # Örnek: CodeSearchNet dataset
        datasets_to_load = [
            "code_search_net",  # GitHub code examples
        ]
        
        examples = []
        for dataset_name in datasets_to_load:
            try:
                dataset = load_dataset(dataset_name, split='train[:1000]')
                for item in dataset:
                    example = CodeExample(
                        id=item.get('repo', 'unknown'),
                        language=item.get('language', 'unknown'),
                        code=item.get('code', ''),
                        description=item.get('docstring', ''),
                        source='github'
                    )
                    examples.append(example)
                logger.info(f"✓ Collected {len(examples)} examples from {dataset_name}")
            except Exception as e:
                logger.warning(f"⚠ Could not load {dataset_name}: {e}")
        
        return examples
    
    def collect_web_examples(self) -> List[CodeExample]:
        """Web kaynaklarından kod örnekleri topla"""
        logger.info("📥 Collecting Web Code Examples...")
        
        # Simulated web scraping results
        examples = [
            CodeExample(
                id="web_001",
                language="jsx",
                code='import React from "react";\n\nexport default function Button({ children }) {\n  return <button>{children}</button>;\n}',
                description="React button component",
                source="web"
            ),
            CodeExample(
                id="web_002",
                language="typescript",
                code='interface User { id: number; name: string; email: string; }',
                description="TypeScript user interface",
                source="web"
            ),
        ]
        
        logger.info(f"✓ Collected {len(examples)} web examples")
        return examples
    
    def save_raw_data(self, examples: List[CodeExample], filename: str = "raw_data.jsonl"):
        """Ham veriyi kaydet"""
        output_path = Path(self.config.raw_data_dir) / filename
        logger.info(f"💾 Saving {len(examples)} examples to {output_path}")
        
        with open(output_path, 'w', encoding=self.config.encoding) as f:
            for example in examples:
                f.write(json.dumps(example.to_dict()) + '\n')
        
        logger.info(f"✓ Saved to {output_path}")
        return output_path


# ==================== DATA CLEANING & PREPROCESSING ====================

class DataProcessor:
    """Veri temizleme ve ön işleme"""
    
    def __init__(self, config: DataConfig):
        self.config = config
        self.duplicates_removed = 0
        self.invalid_removed = 0
    
    def load_raw_data(self, filepath: str) -> List[CodeExample]:
        """Ham veriyi yükle"""
        logger.info(f"📂 Loading raw data from {filepath}")
        examples = []
        
        with open(filepath, 'r', encoding=self.config.encoding) as f:
            for line in f:
                data = json.loads(line.strip())
                example = CodeExample(**data)
                examples.append(example)
        
        logger.info(f"✓ Loaded {len(examples)} examples")
        return examples
    
    def deduplicate(self, examples: List[CodeExample]) -> List[CodeExample]:
        """Aynı veya benzer örnekleri kaldır"""
        logger.info(f"🔍 Deduplicating {len(examples)} examples...")
        
        seen_hashes = set()
        unique_examples = []
        
        for example in examples:
            # Basit hash-based dedup
            code_hash = hashlib.md5(example.code.encode()).hexdigest()
            
            if code_hash not in seen_hashes:
                seen_hashes.add(code_hash)
                unique_examples.append(example)
            else:
                self.duplicates_removed += 1
        
        logger.info(f"✓ Removed {self.duplicates_removed} duplicates | Kept {len(unique_examples)}")
        return unique_examples
    
    def validate_code(self, example: CodeExample) -> bool:
        """Kod geçerliliğini kontrol et"""
        # Temel validasyon
        if not example.code or len(example.code.strip()) == 0:
            return False
        
        if len(example.code) < self.config.min_seq_length:
            return False
        
        if len(example.code) > 100000:  # Çok uzun kodu reddet
            return False
        
        # Zararlı pattern kontrolü
        dangerous_patterns = ['rm -rf', 'DROP TABLE', '__import__']
        for pattern in dangerous_patterns:
            if pattern in example.code:
                return False
        
        return True
    
    def clean_data(self, examples: List[CodeExample]) -> List[CodeExample]:
        """Veriyi temizle"""
        logger.info(f"🧹 Cleaning {len(examples)} examples...")
        
        cleaned_examples = []
        for example in examples:
            if self.validate_code(example):
                # Kod temizleme
                example.code = example.code.strip()
                cleaned_examples.append(example)
            else:
                self.invalid_removed += 1
        
        logger.info(f"✓ Removed {self.invalid_removed} invalid examples | Kept {len(cleaned_examples)}")
        return cleaned_examples
    
    def filter_by_language(self, examples: List[CodeExample], languages: List[str] = None) -> List[CodeExample]:
        """Dile göre filtrele"""
        if languages is None:
            languages = ['python', 'javascript', 'typescript', 'jsx', 'tsx', 'java', 'cpp', 'go', 'rust']
        
        logger.info(f"🗂️ Filtering by languages: {languages}")
        
        filtered = [e for e in examples if e.language.lower() in languages]
        logger.info(f"✓ Kept {len(filtered)} examples from {len(examples)}")
        return filtered
    
    def save_processed_data(self, examples: List[CodeExample], filename: str = "processed_data.jsonl"):
        """İşlenmiş veriyi kaydet"""
        output_path = Path(self.config.processed_data_dir) / filename
        logger.info(f"💾 Saving {len(examples)} processed examples to {output_path}")
        
        with open(output_path, 'w', encoding=self.config.encoding) as f:
            for example in examples:
                f.write(json.dumps(example.to_dict()) + '\n')
        
        logger.info(f"✓ Saved to {output_path}")
        return output_path


# ==================== TOKENIZATION ====================

class TokenizerBuilder:
    """BPE Tokenizer oluşturma ve eğitme"""
    
    def __init__(self, config: DataConfig):
        self.config = config
        self.tokenizer = None
    
    def train_tokenizer(self, examples: List[CodeExample], vocab_size: int = 50257):
        """Tokenizer'ı eğit"""
        logger.info(f"🤖 Training tokenizer with vocab_size={vocab_size}...")
        
        # Eğitim verisi dosyası oluştur
        temp_file = Path(self.config.processed_data_dir) / "tokenizer_training.txt"
        with open(temp_file, 'w', encoding=self.config.encoding) as f:
            for example in examples:
                f.write(example.code + '\n')
        
        # BPE tokenizer oluştur ve eğit
        tokenizer = Tokenizer(models.BPE())
        
        # Normalization ve pre-tokenization
        tokenizer.normalizer = normalizers.Sequence([
            normalizers.NFC(),
        ])
        
        tokenizer.pre_tokenizer = pre_tokenizers.ByteLevel()
        
        # Eğit
        from tokenizers.trainers import BpeTrainer
        trainer = BpeTrainer(
            vocab_size=vocab_size,
            min_frequency=2,
            special_tokens=["<|endoftext|>", "<|pad|>", "<|mask|>"]
        )
        
        tokenizer.train([str(temp_file)], trainer)
        
        # Post-processor
        tokenizer.post_processor = processors.ByteLevel(trim_offsets=True)
        
        self.tokenizer = tokenizer
        logger.info(f"✓ Tokenizer trained with vocab_size={vocab_size}")
        
        return tokenizer
    
    def tokenize_examples(self, examples: List[CodeExample], max_length: int = None) -> List[CodeExample]:
        """Örnekleri tokenize et"""
        if max_length is None:
            max_length = self.config.max_seq_length
        
        logger.info(f"🔤 Tokenizing {len(examples)} examples (max_length={max_length})...")
        
        tokenized_examples = []
        for example in tqdm(examples, desc="Tokenizing"):
            try:
                encoding = self.tokenizer.encode(example.code, max_length=max_length, truncation=True)
                example.tokens = encoding.ids
                tokenized_examples.append(example)
            except Exception as e:
                logger.warning(f"⚠ Error tokenizing example {example.id}: {e}")
        
        logger.info(f"✓ Tokenized {len(tokenized_examples)} examples")
        return tokenized_examples
    
    def save_tokenizer(self, filepath: str = "tokenizer.json"):
        """Tokenizer'ı kaydet"""
        output_path = Path(self.config.processed_data_dir) / filepath
        self.tokenizer.save(str(output_path))
        logger.info(f"💾 Tokenizer saved to {output_path}")
    
    def load_tokenizer(self, filepath: str = "tokenizer.json"):
        """Tokenizer'ı yükle"""
        tokenizer_path = Path(self.config.processed_data_dir) / filepath
        self.tokenizer = Tokenizer.from_file(str(tokenizer_path))
        logger.info(f"✓ Tokenizer loaded from {tokenizer_path}")


# ==================== DATASET SPLITTING ====================

class DataSplitter:
    """Veri setini train/val/test'e böl"""
    
    def __init__(self, config: DataConfig):
        self.config = config
    
    def split_data(self, examples: List[CodeExample]) -> Tuple[List[CodeExample], List[CodeExample], List[CodeExample]]:
        """Veri setini böl"""
        logger.info(f"📊 Splitting {len(examples)} examples into train/val/test...")
        
        total = len(examples)
        train_size = int(total * self.config.train_split)
        val_size = int(total * self.config.val_split)
        
        train_examples = examples[:train_size]
        val_examples = examples[train_size:train_size + val_size]
        test_examples = examples[train_size + val_size:]
        
        logger.info(f"✓ Train: {len(train_examples)} | Val: {len(val_examples)} | Test: {len(test_examples)}")
        
        return train_examples, val_examples, test_examples
    
    def save_splits(self, train: List[CodeExample], val: List[CodeExample], test: List[CodeExample]):
        """Split'leri kaydet"""
        splits = {
            'train': train,
            'validation': val,
            'test': test
        }
        
        for split_name, examples in splits.items():
            output_path = Path(self.config.tokenized_data_dir) / f"{split_name}.jsonl"
            logger.info(f"💾 Saving {split_name} split ({len(examples)} examples) to {output_path}")
            
            with open(output_path, 'w', encoding=self.config.encoding) as f:
                for example in examples:
                    data = example.to_dict()
                    data['tokens'] = data.get('tokens', [])
                    f.write(json.dumps(data) + '\n')
        
        logger.info("✓ All splits saved")


# ==================== MAIN PIPELINE ====================

def run_data_pipeline():
    """Tam veri hazırlama pipeline'ını çalıştır"""
    
    logger.info("=" * 80)
    logger.info("🚀 NEXUS YAHYA - DATA PREPARATION PIPELINE")
    logger.info("=" * 80)
    
    # Konfigürasyon
    config = DataConfig()
    
    # 1. VERİ TOPLAMA
    logger.info("\n[1/5] DATA COLLECTION")
    logger.info("-" * 80)
    collector = DataCollector(config)
    
    github_examples = collector.collect_github_dataset()
    web_examples = collector.collect_web_examples()
    all_examples = github_examples + web_examples
    
    collector.save_raw_data(all_examples)
    
    # 2. VERİ TEMİZLEME
    logger.info("\n[2/5] DATA CLEANING & PREPROCESSING")
    logger.info("-" * 80)
    processor = DataProcessor(config)
    
    raw_examples = processor.load_raw_data(Path(config.raw_data_dir) / "raw_data.jsonl")
    dedup_examples = processor.deduplicate(raw_examples)
    cleaned_examples = processor.clean_data(dedup_examples)
    filtered_examples = processor.filter_by_language(cleaned_examples)
    
    processor.save_processed_data(filtered_examples)
    
    # 3. TOKENIZATION
    logger.info("\n[3/5] TOKENIZATION")
    logger.info("-" * 80)
    tokenizer_builder = TokenizerBuilder(config)
    
    tokenizer = tokenizer_builder.train_tokenizer(filtered_examples, vocab_size=config.vocab_size)
    tokenized_examples = tokenizer_builder.tokenize_examples(filtered_examples)
    tokenizer_builder.save_tokenizer()
    
    # 4. VERİ BÖLME
    logger.info("\n[4/5] TRAIN/VAL/TEST SPLIT")
    logger.info("-" * 80)
    splitter = DataSplitter(config)
    
    train_examples, val_examples, test_examples = splitter.split_data(tokenized_examples)
    splitter.save_splits(train_examples, val_examples, test_examples)
    
    # 5. İSTATİSTİKLER
    logger.info("\n[5/5] DATASET STATISTICS")
    logger.info("-" * 80)
    
    stats = {
        "total_examples": len(tokenized_examples),
        "train_examples": len(train_examples),
        "val_examples": len(val_examples),
        "test_examples": len(test_examples),
        "vocab_size": config.vocab_size,
        "max_seq_length": config.max_seq_length,
        "duplicates_removed": processor.duplicates_removed,
        "invalid_removed": processor.invalid_removed,
        "timestamp": datetime.now().isoformat(),
    }
    
    logger.info(f"\n📊 Dataset Statistics:")
    for key, value in stats.items():
        logger.info(f"  {key}: {value}")
    
    # İstatistikleri kaydet
    stats_path = Path(config.tokenized_data_dir) / "dataset_stats.json"
    with open(stats_path, 'w') as f:
        json.dump(stats, f, indent=2)
    logger.info(f"\n💾 Statistics saved to {stats_path}")
    
    logger.info("\n" + "=" * 80)
    logger.info("✅ DATA PIPELINE COMPLETED SUCCESSFULLY")
    logger.info("=" * 80)
    
    return stats


if __name__ == "__main__":
    stats = run_data_pipeline()
