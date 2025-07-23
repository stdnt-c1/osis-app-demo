-- Create the gallery table
CREATE TABLE gallery (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    src TEXT NOT NULL,
    category TEXT,
    date DATE
);

-- Enable Row Level Security for gallery table
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policy for gallery: SELECT (all authenticated users)
CREATE POLICY "Gallery can be viewed by all authenticated users." ON gallery
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for gallery: INSERT (admin and editor roles)
CREATE POLICY "Gallery can be inserted by admin and editor." ON gallery
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Policy for gallery: UPDATE (admin and editor roles)
CREATE POLICY "Gallery can be updated by admin and editor." ON gallery
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Policy for gallery: DELETE (admin and editor roles)
CREATE POLICY "Gallery can be deleted by admin and editor." ON gallery
  FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Create the berita table
CREATE TABLE berita (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    excerpt TEXT,
    image TEXT,
    category TEXT,
    date DATE
);

-- Enable Row Level Security for berita table
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- Policy for berita: SELECT (all authenticated users)
CREATE POLICY "Berita can be viewed by all authenticated users." ON berita
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for berita: INSERT (admin and editor roles)
CREATE POLICY "Berita can be inserted by admin and editor." ON berita
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Policy for berita: UPDATE (admin and editor roles)
CREATE POLICY "Berita can be updated by admin and editor." ON berita
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Policy for berita: DELETE (admin and editor roles)
CREATE POLICY "Berita can be deleted by admin and editor." ON berita
  FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Create the transaksi table
CREATE TABLE transaksi (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now(),
    tanggal DATE NOT NULL,
    deskripsi TEXT NOT NULL,
    tipe TEXT NOT NULL,
    jumlah BIGINT NOT NULL
);

-- Enable Row Level Security for transaksi table
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;

-- Policy for transaksi: SELECT (all authenticated users)
CREATE POLICY "Transaksi can be viewed by all authenticated users." ON transaksi
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for transaksi: INSERT (admin and keuangan roles)
CREATE POLICY "Transaksi can be inserted by admin and keuangan." ON transaksi
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'keuangan')));

-- Policy for transaksi: UPDATE (admin and keuangan roles)
CREATE POLICY "Transaksi can be updated by admin and keuangan." ON transaksi
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'keuangan')));

-- Policy for transaksi: DELETE (admin and keuangan roles)
CREATE POLICY "Transaksi can be deleted by admin and keuangan." ON transaksi
  FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'keuangan')));

-- Create the saran table
CREATE TABLE saran (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nama TEXT,
    kelas TEXT,
    pesan TEXT NOT NULL,
    status TEXT DEFAULT 'baru'
);

-- Enable Row Level Security for saran table
ALTER TABLE saran ENABLE ROW LEVEL SECURITY;

-- Policy for saran: SELECT (all authenticated users)
CREATE POLICY "Saran can be viewed by all authenticated users." ON saran
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for saran: INSERT (all authenticated users)
CREATE POLICY "Saran can be inserted by all authenticated users." ON saran
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for saran: UPDATE (admin and editor roles)
CREATE POLICY "Saran can be updated by admin and editor." ON saran
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Policy for saran: DELETE (admin and editor roles)
CREATE POLICY "Saran can be deleted by admin and editor." ON saran
  FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')));

-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'editor',
    status TEXT DEFAULT 'active'
);

-- Enable Row Level Security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users: SELECT (admin can view all, others can view their own)
CREATE POLICY "Users can be viewed by admin or self." ON users
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Policy for users: INSERT (only admin can insert)
CREATE POLICY "Users can be inserted by admin." ON users
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Policy for users: UPDATE (admin can update all, others can update their own)
CREATE POLICY "Users can be updated by admin or self." ON users
  FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Policy for users: DELETE (only admin can delete)
CREATE POLICY "Users can be deleted by admin." ON users
  FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
