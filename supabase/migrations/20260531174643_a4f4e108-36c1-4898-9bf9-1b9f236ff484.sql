
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.project_status AS ENUM ('buscando', 'apadrinado', 'completado');

-- ============ UPDATED_AT FN ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ SCHOOLS ============
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  student_count INT NOT NULL DEFAULT 0,
  age_range TEXT NOT NULL,
  training_language TEXT NOT NULL,
  has_materials BOOLEAN NOT NULL DEFAULT false,
  preferred_dates TEXT,
  required_amount NUMERIC NOT NULL DEFAULT 0,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  validated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.schools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT ALL ON public.schools TO service_role;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- ============ AMBASSADORS ============
CREATE TABLE public.ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  cv_url TEXT,
  expertise TEXT NOT NULL,
  motivation TEXT NOT NULL,
  availability TEXT,
  languages TEXT,
  validated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ambassadors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ambassadors TO authenticated;
GRANT ALL ON public.ambassadors TO service_role;
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

-- ============ COMPANIES ============
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  logo_url TEXT,
  commitment BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.companies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  ambassador_id UUID REFERENCES public.ambassadors(id) ON DELETE SET NULL,
  sponsoring_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  status public.project_status NOT NULL DEFAULT 'buscando',
  final_student_count INT,
  testimonials TEXT,
  media_urls TEXT[],
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ POLICIES: schools ============
CREATE POLICY "public reads validated schools" ON public.schools FOR SELECT USING (validated = true);
CREATE POLICY "admins read all schools" ON public.schools FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "anyone can submit a school" ON public.schools FOR INSERT WITH CHECK (validated = false);
CREATE POLICY "admins update schools" ON public.schools FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete schools" ON public.schools FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ POLICIES: ambassadors ============
CREATE POLICY "public reads validated ambassadors" ON public.ambassadors FOR SELECT USING (validated = true);
CREATE POLICY "admins read all ambassadors" ON public.ambassadors FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "anyone can apply as ambassador" ON public.ambassadors FOR INSERT WITH CHECK (validated = false);
CREATE POLICY "admins update ambassadors" ON public.ambassadors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete ambassadors" ON public.ambassadors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ POLICIES: companies ============
CREATE POLICY "public reads companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "anyone can submit a company" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "admins update companies" ON public.companies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete companies" ON public.companies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ POLICIES: projects ============
CREATE POLICY "public reads projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "admins insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ TIMESTAMPS TRIGGERS ============
CREATE TRIGGER trg_schools_updated BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_ambassadors_updated BEFORE UPDATE ON public.ambassadors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO-ADMIN TRIGGER for rafael@skyview.es ============
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'rafael@skyview.es' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============ SEED DEMO DATA ============
WITH s1 AS (
  INSERT INTO public.schools (name, city, country, student_count, age_range, training_language, has_materials, preferred_dates, required_amount, contact_name, contact_email, validated)
  VALUES ('Kibera Girls Academy','Nairobi','Kenya',180,'13-17','English',false,'March 2025',3500,'Mary Wanjiku','mary@kiberagirls.edu.ke',true)
  RETURNING id
),
s2 AS (
  INSERT INTO public.schools (name, city, country, student_count, age_range, training_language, has_materials, preferred_dates, required_amount, contact_name, contact_email, validated)
  VALUES ('Lagos Tech Secondary School','Lagos','Nigeria',320,'14-18','English',true,'February 2025',2800,'Emmanuel Okonkwo','e.okonkwo@lagostech.ng',true)
  RETURNING id
),
s3 AS (
  INSERT INTO public.schools (name, city, country, student_count, age_range, training_language, has_materials, preferred_dates, required_amount, contact_name, contact_email, validated)
  VALUES ('Accra Future Academy','Accra','Ghana',220,'12-16','English',false,'April 2025',4200,'Kwame Asante','k.asante@accrafuture.gh',true)
  RETURNING id
),
a1 AS (
  INSERT INTO public.ambassadors (name, country, email, linkedin, cv_url, expertise, motivation, validated)
  VALUES ('Sarah Chen','United States','sarah.chen@email.com','https://linkedin.com/in/sarahchen','https://drive.google.com/cv-sarahchen','ML Engineer with 8 years experience in NLP and computer vision','Passionate about democratizing AI education globally',true)
  RETURNING id
),
a2 AS (
  INSERT INTO public.ambassadors (name, country, email, linkedin, cv_url, expertise, motivation, validated)
  VALUES ('Amadou Diallo','France','a.diallo@email.fr','https://linkedin.com/in/amadoudiallo','https://drive.google.com/cv-amadou','AI researcher specializing in education technology','Want to give back to my home continent through tech education',true)
  RETURNING id
),
c1 AS (
  INSERT INTO public.companies (name, contact_name, contact_email, commitment)
  VALUES ('TechForGood Foundation','Jennifer Martinez','jennifer@techforgood.org',true)
  RETURNING id
)
INSERT INTO public.projects (school_id, ambassador_id, sponsoring_company_id, status, final_student_count, testimonials, comments)
SELECT s1.id, a1.id, c1.id, 'apadrinado'::public.project_status, NULL, NULL, NULL FROM s1, a1, c1
UNION ALL
SELECT s2.id, a2.id, NULL, 'completado'::public.project_status, 315, 'The students were incredibly engaged! Many expressed interest in pursuing AI careers.', 'Amadou was fantastic. Would love to host him again.' FROM s2, a2
UNION ALL
SELECT s3.id, NULL, NULL, 'buscando'::public.project_status, NULL, NULL, NULL FROM s3;
