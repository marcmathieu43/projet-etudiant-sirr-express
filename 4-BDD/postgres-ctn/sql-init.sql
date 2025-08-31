-- Create conversations table
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    datecreation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    nbmessage INTEGER NOT NULL DEFAULT 0,
    dureevie INTEGER NOT NULL,
    nbacces INTEGER NOT NULL DEFAULT 0,
    media BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance 
CREATE INDEX IF NOT EXISTS idx_conversations_datecreation ON conversations(datecreation);  -- recherches par date creation
CREATE INDEX IF NOT EXISTS idx_conversations_dureevie ON conversations(dureevie);   -- requêtes WHERE dureevie = ... ou ORDER BY dureevie d’être plus rapides



CREATE TABLE elements_conv (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    
    -- Données chiffrées en base64
    content TEXT,           -- Contenu chiffré (AES-GCM), encodé en base64
    nonce TEXT,             -- Nonce utilisé pour le chiffrement, encodé en base64
    tag_element TEXT,       -- Tag chiffré (optionnel, si séparé), encodé en base64

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_to_element_id UUID,

    -- Foreign keys
    CONSTRAINT fk_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reply_to_element
        FOREIGN KEY (reply_to_element_id)
        REFERENCES elements_conv(id)
        ON DELETE SET NULL
);
