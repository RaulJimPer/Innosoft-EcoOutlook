import {
  CalendarEvent,
  Contact,
  DatasetState,
  DriveFile,
  DriveFolder,
  FileVersion,
  MailAttachment,
  MailFolder,
  MailMessage,
  Recipient,
  ScoringCase,
  StorageUnit,
} from '../../domain/types';

export function buildDataset(): DatasetState {
  // ----------------------------------------------------
  // 1. Folders
  // ----------------------------------------------------
  const mailFolders: MailFolder[] = [
    { id: 'inbox', name: 'Bandeja de entrada', type: 'system', systemRole: 'inbox' },
    { id: 'sent', name: 'Elementos enviados', type: 'system', systemRole: 'sent' },
    { id: 'drafts', name: 'Borradores', type: 'system', systemRole: 'drafts' },
    { id: 'archive', name: 'Archivados', type: 'system', systemRole: 'archive' },
    { id: 'junk', name: 'Correo no deseado', type: 'system', systemRole: 'junk' },
    { id: 'trash', name: 'Papelera', type: 'system', systemRole: 'trash' },
    { id: 'archive_admin', name: 'Administración', type: 'custom', parentFolderId: 'archive' },
    { id: 'archive_actas', name: 'Actas', type: 'custom', parentFolderId: 'archive' },
    { id: 'archive_informes', name: 'Informes históricos', type: 'custom', parentFolderId: 'archive' },
    { id: 'archive_proyectos', name: 'Proyectos cerrados', type: 'custom', parentFolderId: 'archive' },
    { id: 'archive_revisar', name: 'Revisar antes de eliminar', type: 'custom', parentFolderId: 'archive' },
  ];

  const folderNames = [
    'Administración',
    'Jornadas de sostenibilidad',
    'Comunicación',
    'Proyectos',
    'Equipo de eventos',
    'Recursos Humanos',
    'Proveedores',
    'Informes',
    'Presentaciones',
    'Actas',
    'Presupuestos',
    'Multimedia',
    'Vídeos',
    'Fotografías',
    'Plantillas',
    'Archivo histórico',
    'Compartido',
    'Revisar antes de eliminar',
  ];

  const driveFolders: DriveFolder[] = folderNames.map((name, idx) => ({
    id: `folder_${(idx + 1).toString().padStart(2, '0')}`,
    name,
    parentFolderId: undefined,
    status: 'active',
  }));

  const getFolderId = (name: string): string => {
    const f = driveFolders.find((df) => df.name.toLowerCase() === name.toLowerCase());
    return f ? f.id : driveFolders[0].id;
  };

  // ----------------------------------------------------
  // 2. Contacts (64)
  // ----------------------------------------------------
  const contacts: Contact[] = [
    {
      id: 'cnt_con001_prim',
      firstName: 'Elena',
      lastName: 'Gómez Vidal',
      displayName: 'Elena Gómez',
      email: 'elena.gomez@us.example',
      secondaryEmails: [],
      phone: '+34 954 112 233',
      organization: 'Universidad de Sevilla',
      role: 'Coordinadora de Calidad',
      department: 'Calidad Institucional',
      groups: ['Comité de Calidad', 'PDI'],
      favorite: false,
      notes: 'Contacto principal para auditorías.',
      status: 'active',
      scoringCaseId: 'CON-001',
    },
    {
      id: 'cnt_con001_sec',
      firstName: 'Elena',
      lastName: 'Gómez Vidal',
      displayName: 'Elena Gómez (Duplicado)',
      email: 'elena.gomez@us.example',
      secondaryEmails: [],
      phone: '+34 954 112 233',
      organization: 'Universidad de Sevilla',
      role: 'Coordinadora de Calidad',
      department: 'Calidad Institucional',
      groups: ['Comité de Calidad'],
      favorite: false,
      notes: 'Copia duplicada creada por importación.',
      status: 'active',
      scoringCaseId: 'CON-001',
    },
    {
      id: 'cnt_con002_prim',
      firstName: 'Marcos',
      lastName: 'Ruiz Delgado',
      displayName: 'Marcos Ruiz',
      email: 'm.ruiz@us.example',
      secondaryEmails: [],
      phone: '+34 611 223 344',
      organization: 'Secretaría de Extensión',
      role: '',
      department: '',
      groups: ['Organización'],
      favorite: false,
      notes: 'Mantiene el teléfono móvil directo.',
      status: 'active',
      scoringCaseId: 'CON-002',
    },
    {
      id: 'cnt_con002_sec',
      firstName: 'Marcos',
      lastName: 'Ruiz Delgado',
      displayName: 'Marcos Ruiz (Extensión)',
      email: 'm.ruiz@us.example',
      secondaryEmails: [],
      phone: '',
      organization: 'Secretaría de Extensión',
      role: 'Jefe de Secretaría',
      department: 'Extensión Universitaria',
      groups: ['Organización', 'Gestión'],
      favorite: false,
      notes: 'Contiene cargo y departamento oficial.',
      status: 'active',
      scoringCaseId: 'CON-002',
    },
    {
      id: 'cnt_con003_a',
      firstName: 'Carlos',
      lastName: 'Santos Ruiz',
      displayName: 'Carlos Santos Ruiz',
      email: 'csantos.ruiz@ciencias.us.example',
      secondaryEmails: [],
      phone: '+34 954 551 001',
      organization: 'Facultad de Química',
      role: 'Profesor Titular',
      department: 'Química Inorgánica',
      groups: ['PDI', 'Investigación'],
      favorite: false,
      notes: 'Investigador principal en materiales.',
      status: 'active',
      scoringCaseId: 'CON-003',
    },
    {
      id: 'cnt_con003_b',
      firstName: 'Carlos',
      lastName: 'Santos Reina',
      displayName: 'Carlos Santos Reina',
      email: 'csantos.reina@servicios.us.example',
      secondaryEmails: [],
      phone: '+34 954 552 002',
      organization: 'Servicio de Mantenimiento',
      role: 'Técnico de Climatización',
      department: 'Infraestructuras',
      groups: ['PAS', 'Mantenimiento'],
      favorite: false,
      notes: 'Técnico de guardia en campus Reina Mercedes.',
      status: 'active',
      scoringCaseId: 'CON-003',
    },
    {
      id: 'cnt_con004',
      firstName: 'Servicios',
      lastName: 'Gráficos Sur',
      displayName: 'Servicios Gráficos Sur',
      email: 'contacto@graficassur.example',
      secondaryEmails: ['pedidos@graficassur.example'],
      phone: '+34 955 998 877',
      organization: 'Gráficas Sur SL',
      role: 'Atención al Cliente',
      department: 'Comercial',
      groups: ['Proveedores'],
      favorite: false,
      notes: 'Contrato de reprografía finalizado en 2023. Sin actividad posterior.',
      status: 'active',
      scoringCaseId: 'CON-004',
    },
    {
      id: 'cnt_con005',
      firstName: 'Carmen',
      lastName: 'Soler Bernabé',
      displayName: 'Dra. Carmen Soler',
      email: 'carmen.soler@us.example',
      secondaryEmails: ['csoler@investigacion.example'],
      phone: '+34 670 123 456',
      organization: 'Comisión de Sostenibilidad',
      role: 'Presidenta del Comité Organizador',
      department: 'Ecología y Medio Ambiente',
      groups: ['Jornadas Sostenibilidad', 'PDI', 'Dirección'],
      favorite: true,
      notes: 'Contacto clave para las Jornadas de Sostenibilidad 2026. No borrar.',
      status: 'active',
      scoringCaseId: 'CON-005',
    },
    {
      id: 'cnt_con006',
      firstName: 'Antonio',
      lastName: 'Beltrán Castro',
      displayName: 'Antonio Beltrán',
      email: 'antonio.beltran.antiguo@antiguo.us.example',
      secondaryEmails: [],
      phone: '+34 688 445 566',
      organization: 'Centro de Informática',
      role: 'Administrador de Sistemas',
      department: 'TIC',
      groups: ['Soporte TIC'],
      favorite: false,
      notes: 'Nuevo correo corporativo confirmado: a.beltran@us.example',
      status: 'active',
      scoringCaseId: 'CON-006',
    },
    {
      id: 'cnt_con007_pers',
      firstName: 'Vicente',
      lastName: 'Morales Alarcón',
      displayName: 'Vicente Morales',
      email: 'vmorales@us.example',
      secondaryEmails: [],
      phone: '+34 954 559 900',
      organization: 'Departamento de Derecho',
      role: 'Profesor Contratado Doctor',
      department: 'Derecho Financiero',
      groups: ['PDI'],
      favorite: false,
      notes: 'Contacto personal del profesor Vicente Morales.',
      status: 'active',
      scoringCaseId: 'CON-007',
    },
    {
      id: 'cnt_con007_shared',
      firstName: 'Buzón',
      lastName: 'Secretaría Derecho',
      displayName: 'Secretaría Departamento Derecho',
      email: 'secretaria.derecho@us.example',
      secondaryEmails: ['derecho.buzon@us.example'],
      phone: '+34 954 559 901',
      organization: 'Facultad de Derecho',
      role: 'Buzón Compartido',
      department: 'Administración',
      groups: ['Buzones Compartidos', 'PAS'],
      favorite: false,
      notes: 'Buzón institucional oficial gestionado por 4 administrativos.',
      status: 'active',
      scoringCaseId: 'CON-007',
    },
    {
      id: 'cnt_con008_prim',
      firstName: 'Patricia',
      lastName: 'Vega Luque',
      displayName: 'Patricia Vega',
      email: 'p.vega@instituto.us.example',
      secondaryEmails: [],
      phone: '+34 655 889 900',
      organization: 'Instituto del Agua',
      role: 'Investigadora Postdoctoral',
      department: 'Recursos Hídricos',
      groups: ['Investigación'],
      favorite: false,
      notes: 'Ficha actual con el nuevo correo del instituto.',
      status: 'active',
      scoringCaseId: 'CON-008',
    },
    {
      id: 'cnt_con008_sec',
      firstName: 'Patricia',
      lastName: 'Vega Luque',
      displayName: 'Patricia Vega (Anterior)',
      email: 'patricia.vega@antigua-sede.example',
      secondaryEmails: [],
      phone: '+34 655 889 900',
      organization: 'Instituto del Agua',
      role: 'Investigadora',
      department: 'Recursos Hídricos',
      groups: ['Investigación'],
      favorite: false,
      notes: 'Contiene dirección histórica todavía usada por colaboradores externos.',
      status: 'active',
      scoringCaseId: 'CON-008',
    },
    {
      id: 'cnt_con009',
      firstName: 'Logística',
      lastName: 'Aljarafe SL',
      displayName: 'Logística Aljarafe SL',
      email: 'facturacion@aljarafesl.example',
      secondaryEmails: ['envios@aljarafesl.example'],
      phone: '+34 954 776 655',
      organization: 'Logística Aljarafe SL',
      role: 'Transporte y Almacén',
      department: 'Operaciones',
      groups: ['Proveedores'],
      favorite: false,
      notes: 'Proveedor antiguo. Clasificar en grupo "Histórico" para trazabilidad de facturas.',
      status: 'active',
      scoringCaseId: 'CON-009',
    },
    {
      id: 'cnt_con010_prim',
      firstName: 'Manuel',
      lastName: 'Herrero Prieto',
      displayName: 'Dr. Manuel Herrero',
      email: 'mherrero@us.example',
      secondaryEmails: [],
      phone: '+34 954 553 322',
      organization: 'Vicerrectorado de Investigación',
      role: 'Director de Secretariado',
      department: 'Investigación',
      groups: ['Dirección', 'Jornadas Sostenibilidad'],
      favorite: true,
      notes: 'Ficha asociada a eventos clave del calendario.',
      status: 'active',
      scoringCaseId: 'CON-010',
    },
    {
      id: 'cnt_con010_sec',
      firstName: 'Manuel',
      lastName: 'Herrero Prieto',
      displayName: 'Manuel Herrero (Móvil personal)',
      email: 'mherrero.personal@correo.example',
      secondaryEmails: [],
      phone: '+34 699 332 211',
      organization: 'Vicerrectorado de Investigación',
      role: 'Director de Secretariado',
      department: 'Investigación',
      groups: ['Dirección'],
      favorite: false,
      notes: 'Contiene teléfono móvil directo para urgencias del congreso.',
      status: 'active',
      scoringCaseId: 'CON-010',
    },
  ];

  const genericNames = [
    ['Alejandro', 'Navarro Ortiz', 'Decano', 'Facultad de Biología', '+34 954 551 122'],
    ['Beatriz', 'López Garrido', 'Técnica de Laboratorio', 'Biología Celular', '+34 954 551 123'],
    ['Daniel', 'Ramos Silva', 'Profesor Ayudante Doctor', 'Física Aplicada', '+34 954 551 124'],
    ['Esther', 'Molina Campos', 'Secretaria Administrativa', 'Decanato Biología', '+34 954 551 125'],
    ['Fernando', 'Gallego Torres', 'Conserje Mayor', 'Conserjería Central', '+34 954 551 126'],
    ['Gloria', 'Serrano Peña', 'Directora de Comunicación', 'Gabinete de Prensa', '+34 954 551 127'],
    ['Héctor', 'Crespo Blanco', 'Diseñador Gráfico', 'Comunicación Institucional', '+34 954 551 128'],
    ['Inés', 'Paredes Cano', 'Responsable de Redes', 'Comunicación Institucional', '+34 954 551 129'],
    ['Javier', 'Pérez Lozano', 'Catedrático', 'Ingeniería Química', '+34 954 551 130'],
    ['Lucía', 'Méndez Rivas', 'Investigadora Predoctoral', 'Química Ambiental', '+34 954 551 131'],
    ['Mario', 'Fuentes Romero', 'Técnico de Sonido', 'Medios Audiovisuales', '+34 954 551 132'],
    ['Nuria', 'Castro Hidalgo', 'Coordinadora Erasmus', 'Relaciones Internacionales', '+34 954 551 133'],
    ['Óscar', 'Vázquez Gil', 'Asesor Jurídico', 'Asesoría Jurídica', '+34 954 551 134'],
    ['Pilar', 'Domínguez León', 'Jefa de Compras', 'Servicio de Contratación', '+34 954 551 135'],
    ['Rafael', 'Iglesias Sanz', 'Auditor Interno', 'Control Interno', '+34 954 551 136'],
    ['Sara', 'Caballero Mora', 'Técnica de Prevención', 'Servicio de Prevención', '+34 954 551 137'],
    ['Tomás', 'Nieto Ortega', 'Técnico de Clima', 'Mantenimiento General', '+34 954 551 138'],
    ['Úrsula', 'Reyes Aguilar', 'Directora de Biblioteca', 'Biblioteca Universitaria', '+34 954 551 139'],
    ['Víctor', 'Benítez Cordero', 'Bibliotecario', 'Biblioteca Central', '+34 954 551 140'],
    ['Yolanda', 'Arias Montero', 'Gestora de Proyectos', 'OTRI', '+34 954 551 141'],
    ['Alberto', 'Salas Roldán', 'Técnico OTRI', 'Transferencia Tecnológica', '+34 954 551 142'],
    ['Blanca', 'Pacheco Díaz', 'Responsable de Protocolo', 'Protocolo Rectorado', '+34 954 551 143'],
    ['César', 'Pardo Marín', 'Fotógrafo Oficial', 'Medios Audiovisuales', '+34 954 551 144'],
    ['Diana', 'Cruz Solís', 'Técnica de Sostenibilidad', 'Oficina de Sostenibilidad', '+34 954 551 145'],
    ['Enrique', 'Lara Ibáñez', 'Educador Ambiental', 'Voluntariado Ambiental', '+34 954 551 146'],
    ['Fátima', 'Alonso Bravo', 'Representante de Alumnos', 'Consejo de Alumnos', '+34 954 551 147'],
    ['Guillermo', 'Valle Esteban', 'Delegado de Centro', 'Delegación de Alumnos', '+34 954 551 148'],
    ['Helena', 'Soria Morales', 'Catering Manager', 'Catering Doña Ana SL', '+34 954 551 149'],
    ['Ignacio', 'Giménez Rubio', 'Comercial Técnico', 'Sistemas Audiovisuales Betis', '+34 954 551 150'],
    ['Julia', 'Maldonado Vega', 'Proveedora Material', 'Papelería Universitaria SA', '+34 954 551 151'],
    ['Kevin', 'Orozco Santos', 'Servicio de Seguridad', 'Seguridad Prosegur', '+34 954 551 152'],
    ['Lorena', 'Prieto Carmona', 'Limpieza y Desinfección', 'Servilimpiezas Al-Andalus', '+34 954 551 153'],
    ['Manuel', 'Castillo Gallego', 'Coordinador de Voluntarios', 'Vicerrectorado Social', '+34 954 551 154'],
    ['Natalia', 'Vargas Cano', 'Técnica de Igualdad', 'Unidad de Igualdad', '+34 954 551 155'],
    ['Olga', 'Bernal Jurado', 'Secretaria del Rector', 'Gabinete del Rector', '+34 954 551 156'],
    ['Pablo', 'Herrera Montes', 'Vicerrector de Campus', 'Rectorado', '+34 954 551 157'],
    ['Quiteria', 'Salguero Paz', 'Técnica de Nóminas', 'Recursos Humanos', '+34 954 551 158'],
    ['Rodrigo', 'Cano Barroso', 'Jefe de Sección Personal', 'Recursos Humanos', '+34 954 551 159'],
    ['Silvia', 'Luna Arjona', 'Directora de Posgrado', 'Escuela de Doctorado', '+34 954 551 160'],
    ['Teodoro', 'Rico Carvajal', 'Secretario de Doctorado', 'Escuela de Doctorado', '+34 954 551 161'],
    ['Valeria', 'Estrada Ponce', 'Coordinadora de Máster', 'Máster de Sostenibilidad', '+34 954 551 162'],
    ['Wilfredo', 'Mora Zambrano', 'Profesor Visitante', 'Ecología Urbana', '+34 954 551 163'],
    ['Xenia', 'Bello Cuenca', 'Técnica de Calidad', 'Unidad para la Calidad', '+34 954 551 164'],
    ['Zacarías', 'Guerra Rincón', 'Responsable de Almacén', 'Almacén Central', '+34 954 551 165'],
    ['Araceli', 'Palacios Vera', 'Gestora de Movilidad', 'Oficina de Movilidad', '+34 954 551 166'],
    ['Borja', 'Santana Gil', 'Técnico de Redes', 'Centro de Informática', '+34 954 551 167'],
    ['Consuelo', 'Márquez Flor', 'Auxiliar de Enfermería', 'Servicio Médico', '+34 954 551 168'],
    ['Damián', 'Lucena Ocaña', 'Médico de Empresa', 'Servicio Médico', '+34 954 551 169'],
  ];

  let namePtr = 0;
  while (contacts.length < 64) {
    const [fn, ln, role, dept, ph] = genericNames[namePtr % genericNames.length];
    const emailPrefix = `${fn.toLowerCase()}.${ln.split(' ')[0].toLowerCase()}`;
    contacts.push({
      id: `cnt_gen_${(contacts.length + 1).toString().padStart(3, '0')}`,
      firstName: fn,
      lastName: ln,
      displayName: `${fn} ${ln}`,
      email: `${emailPrefix}@us.example`,
      secondaryEmails: [],
      phone: ph,
      organization: 'Universidad de Sevilla',
      role,
      department: dept,
      groups: [dept],
      favorite: contacts.length % 8 === 0,
      notes: `Registro institucional de ${fn} ${ln}.`,
      status: 'active',
    });
    namePtr++;
  }

  // ----------------------------------------------------
  // 3. Storage Units Collection (populated along with files/mail)
  // ----------------------------------------------------
  const storageUnits: StorageUnit[] = [];

  const addStorageUnit = (
    id: string,
    sizeBytes: number,
    kind: StorageUnit['kind'],
    status: 'active' | 'trash' = 'active',
    ownerId: string
  ): StorageUnit => {
    const unit: StorageUnit = {
      id,
      sizeBytes,
      kind,
      status,
      originalStatus: status,
      ownerEntityIds: [ownerId],
    };
    storageUnits.push(unit);
    return unit;
  };

  // ----------------------------------------------------
  // 4. Drive Files (Exactly 120 files in 18 folders)
  // ----------------------------------------------------
  const driveFiles: DriveFile[] = [];
  const fileVersions: FileVersion[] = [];

  // Mapped files for FILE cases (FILE-001 to FILE-025)
  // FILE-001: Three copies of final presentation in different folders
  const f001_can_su = addStorageUnit('su_f001_can', 45_000_000, 'drive-file', 'active', 'file_001_can');
  driveFiles.push({
    id: 'file_001_can',
    name: 'Presentacion_Jornadas_Final.pptx',
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'sheets',
    folderId: getFolderId('Presentaciones'),
    createdAt: '2026-10-15T10:00:00',
    modifiedAt: '2026-11-02T14:30:00',
    currentVersionId: 'ver_f001_can',
    versionIds: ['ver_f001_can'],
    storageUnitId: f001_can_su.id,
    shared: true,
    favorite: true,
    tags: ['canónica', 'compartida'],
    duplicateGroupId: 'dup_grp_f001',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-001',
    status: 'active',
    descriptionPreview: 'Presentación final compartida con todo el comité de las jornadas.',
  });
  fileVersions.push({
    id: 'ver_f001_can',
    fileId: 'file_001_can',
    versionNumber: 1,
    modifiedAt: '2026-11-02T14:30:00',
    storageUnitId: f001_can_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f001_dup1_su = addStorageUnit('su_f001_dup1', 45_000_000, 'drive-file', 'active', 'file_001_dup1');
  driveFiles.push({
    id: 'file_001_dup1',
    name: 'Copia de Presentacion_Jornadas_Final.pptx',
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'sheets',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-16T11:00:00',
    modifiedAt: '2026-11-02T14:30:00',
    currentVersionId: 'ver_f001_dup1',
    versionIds: ['ver_f001_dup1'],
    storageUnitId: f001_dup1_su.id,
    shared: false,
    favorite: false,
    tags: ['duplicado'],
    duplicateGroupId: 'dup_grp_f001',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-001',
    status: 'active',
    descriptionPreview: 'Copia idéntica en carpeta de proyectos.',
  });
  fileVersions.push({
    id: 'ver_f001_dup1',
    fileId: 'file_001_dup1',
    versionNumber: 1,
    modifiedAt: '2026-11-02T14:30:00',
    storageUnitId: f001_dup1_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f001_dup2_su = addStorageUnit('su_f001_dup2', 45_000_000, 'drive-file', 'active', 'file_001_dup2');
  driveFiles.push({
    id: 'file_001_dup2',
    name: 'Presentacion_Jornadas_Final_backup.pptx',
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'sheets',
    folderId: getFolderId('Equipo de eventos'),
    createdAt: '2026-10-17T12:00:00',
    modifiedAt: '2026-11-02T14:30:00',
    currentVersionId: 'ver_f001_dup2',
    versionIds: ['ver_f001_dup2'],
    storageUnitId: f001_dup2_su.id,
    shared: false,
    favorite: false,
    tags: ['duplicado'],
    duplicateGroupId: 'dup_grp_f001',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-001',
    status: 'active',
    descriptionPreview: 'Tercera copia idéntica en Equipo de eventos.',
  });
  fileVersions.push({
    id: 'ver_f001_dup2',
    fileId: 'file_001_dup2',
    versionNumber: 1,
    modifiedAt: '2026-11-02T14:30:00',
    storageUnitId: f001_dup2_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-002: Old software installer
  const f002_su = addStorageUnit('su_f002', 320_000_000, 'drive-file', 'active', 'file_002');
  driveFiles.push({
    id: 'file_002',
    name: 'LibreOffice_7.4.2_Win_x64_install.msi',
    extension: 'msi',
    mimeType: 'application/x-msi',
    category: 'other',
    folderId: getFolderId('Administración'),
    createdAt: '2023-04-10T11:00:00',
    modifiedAt: '2023-04-10T11:00:00',
    currentVersionId: 'ver_f002',
    versionIds: ['ver_f002'],
    storageUnitId: f002_su.id,
    shared: false,
    favorite: false,
    tags: ['instalador', 'obsoleto'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-002',
    status: 'active',
    descriptionPreview: 'Instalador de software de hace 3 años. El programa ya está instalado.',
  });
  fileVersions.push({
    id: 'ver_f002',
    fileId: 'file_002',
    versionNumber: 1,
    modifiedAt: '2023-04-10T11:00:00',
    storageUnitId: f002_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-003: Master video of conference (no alternative copy, historical archive)
  const f003_su = addStorageUnit('su_f003', 1_400_000_000, 'drive-file', 'active', 'file_003');
  driveFiles.push({
    id: 'file_003',
    name: 'Grabacion_Master_Inauguracion_2025.mp4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    category: 'videos',
    folderId: getFolderId('Vídeos'),
    createdAt: '2025-11-10T18:00:00',
    modifiedAt: '2025-11-10T18:00:00',
    currentVersionId: 'ver_f003',
    versionIds: ['ver_f003'],
    storageUnitId: f003_su.id,
    shared: true,
    favorite: true,
    tags: ['archivo histórico', 'único'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-003',
    status: 'active',
    descriptionPreview: 'Vídeo máster original de la inauguración. Sin copia alternativa.',
  });
  fileVersions.push({
    id: 'ver_f003',
    fileId: 'file_003',
    versionNumber: 1,
    modifiedAt: '2025-11-10T18:00:00',
    storageUnitId: f003_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-004: Temp export cache
  const f004_su = addStorageUnit('su_f004', 180_000_000, 'drive-file', 'active', 'file_004');
  driveFiles.push({
    id: 'file_004',
    name: 'render_cache_temp_octubre.dat',
    extension: 'dat',
    mimeType: 'application/octet-stream',
    category: 'other',
    folderId: getFolderId('Multimedia'),
    createdAt: '2026-10-25T15:00:00',
    modifiedAt: '2026-10-25T15:00:00',
    currentVersionId: 'ver_f004',
    versionIds: ['ver_f004'],
    storageUnitId: f004_su.id,
    shared: false,
    favorite: false,
    tags: ['temporal', 'cache'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-004',
    status: 'active',
    descriptionPreview: 'Caché temporal de exportación de vídeo. Se regenera automáticamente.',
  });
  fileVersions.push({
    id: 'ver_f004',
    fileId: 'file_004',
    versionNumber: 1,
    modifiedAt: '2026-10-25T15:00:00',
    storageUnitId: f004_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-005: Unique team photo backup
  const f005_su = addStorageUnit('su_f005', 420_000_000, 'drive-file', 'active', 'file_005');
  driveFiles.push({
    id: 'file_005',
    name: 'Fotos_Equipo_Sostenibilidad_Originales_RAW.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'compressed',
    folderId: getFolderId('Fotografías'),
    createdAt: '2026-09-12T10:00:00',
    modifiedAt: '2026-09-12T10:00:00',
    currentVersionId: 'ver_f005',
    versionIds: ['ver_f005'],
    storageUnitId: f005_su.id,
    shared: false,
    favorite: true,
    tags: ['backup único', 'importante'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-005',
    status: 'active',
    descriptionPreview: 'Backup único de fotografías originales del equipo. Sin sincronización externa.',
  });
  fileVersions.push({
    id: 'ver_f005',
    fileId: 'file_005',
    versionNumber: 1,
    modifiedAt: '2026-09-12T10:00:00',
    storageUnitId: f005_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-006: Duplicate report copy
  const f006_can_su = addStorageUnit('su_f006_can', 28_000_000, 'drive-file', 'active', 'file_006_can');
  driveFiles.push({
    id: 'file_006_can',
    name: 'Informe_Anual_Sostenibilidad_2025_Oficial.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Informes'),
    createdAt: '2026-01-20T11:00:00',
    modifiedAt: '2026-01-20T11:00:00',
    currentVersionId: 'ver_f006_can',
    versionIds: ['ver_f006_can'],
    storageUnitId: f006_can_su.id,
    shared: true,
    favorite: false,
    tags: ['oficial', 'biblioteca'],
    duplicateGroupId: 'dup_grp_f006',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-006',
    status: 'active',
    descriptionPreview: 'Informe oficial depositado en la biblioteca institucional.',
  });
  fileVersions.push({
    id: 'ver_f006_can',
    fileId: 'file_006_can',
    versionNumber: 1,
    modifiedAt: '2026-01-20T11:00:00',
    storageUnitId: f006_can_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f006_dup_su = addStorageUnit('su_f006_dup', 28_000_000, 'drive-file', 'active', 'file_006_dup');
  driveFiles.push({
    id: 'file_006_dup',
    name: 'Copia_Informe_Anual_Sostenibilidad_2025.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Comunicación'),
    createdAt: '2026-02-05T09:00:00',
    modifiedAt: '2026-02-05T09:00:00',
    currentVersionId: 'ver_f006_dup',
    versionIds: ['ver_f006_dup'],
    storageUnitId: f006_dup_su.id,
    shared: false,
    favorite: false,
    tags: ['copia duplicada'],
    duplicateGroupId: 'dup_grp_f006',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-006',
    status: 'active',
    descriptionPreview: 'Copia duplicada en la carpeta de comunicación.',
  });
  fileVersions.push({
    id: 'ver_f006_dup',
    fileId: 'file_006_dup',
    versionNumber: 1,
    modifiedAt: '2026-02-05T09:00:00',
    storageUnitId: f006_dup_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-007: Signed final minutes in temporary folder
  const f007_su = addStorageUnit('su_f007', 8_500_000, 'drive-file', 'active', 'file_007');
  driveFiles.push({
    id: 'file_007',
    name: 'Acta_Constitucion_Comite_Firmada.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Revisar antes de eliminar'), // initially in temp/review folder!
    createdAt: '2026-09-01T10:00:00',
    modifiedAt: '2026-09-01T10:00:00',
    currentVersionId: 'ver_f007',
    versionIds: ['ver_f007'],
    storageUnitId: f007_su.id,
    shared: false,
    favorite: false,
    tags: ['acta', 'firmada'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-007',
    status: 'active',
    descriptionPreview: 'Acta oficial firmada que debe moverse a la carpeta oficial de Actas.',
  });
  fileVersions.push({
    id: 'ver_f007',
    fileId: 'file_007',
    versionNumber: 1,
    modifiedAt: '2026-09-01T10:00:00',
    storageUnitId: f007_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-008: Version history with 4 obsolete intermediate versions and 1 current correct
  const f008_v1_su = addStorageUnit('su_f008_v1', 35_000_000, 'file-version', 'active', 'file_008');
  const f008_v2_su = addStorageUnit('su_f008_v2', 36_000_000, 'file-version', 'active', 'file_008');
  const f008_v3_su = addStorageUnit('su_f008_v3', 37_000_000, 'file-version', 'active', 'file_008');
  const f008_v4_su = addStorageUnit('su_f008_v4', 38_000_000, 'file-version', 'active', 'file_008');
  const f008_cur_su = addStorageUnit('su_f008_cur', 40_000_000, 'drive-file', 'active', 'file_008');

  driveFiles.push({
    id: 'file_008',
    name: 'Guia_Buenas_Practicas_Ambientales.docx',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    folderId: getFolderId('Plantillas'),
    createdAt: '2026-05-10T09:00:00',
    modifiedAt: '2026-10-30T17:00:00',
    currentVersionId: 'ver_f008_v5',
    versionIds: ['ver_f008_v1', 'ver_f008_v2', 'ver_f008_v3', 'ver_f008_v4', 'ver_f008_v5'],
    storageUnitId: f008_cur_su.id,
    shared: true,
    favorite: false,
    tags: ['versiones', 'guía'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-008',
    status: 'active',
    descriptionPreview: 'Guía oficial con 4 versiones intermedias obsoletas en su historial.',
  });
  fileVersions.push(
    { id: 'ver_f008_v1', fileId: 'file_008', versionNumber: 1, modifiedAt: '2026-05-10T09:00:00', storageUnitId: f008_v1_su.id, isCurrent: false, note: 'Borrador inicial v1', status: 'active' },
    { id: 'ver_f008_v2', fileId: 'file_008', versionNumber: 2, modifiedAt: '2026-06-15T11:00:00', storageUnitId: f008_v2_su.id, isCurrent: false, note: 'Revisión intermedia v2', status: 'active' },
    { id: 'ver_f008_v3', fileId: 'file_008', versionNumber: 3, modifiedAt: '2026-07-20T14:00:00', storageUnitId: f008_v3_su.id, isCurrent: false, note: 'Comentarios del comité v3', status: 'active' },
    { id: 'ver_f008_v4', fileId: 'file_008', versionNumber: 4, modifiedAt: '2026-09-10T16:00:00', storageUnitId: f008_v4_su.id, isCurrent: false, note: 'Pre-final v4', status: 'active' },
    { id: 'ver_f008_v5', fileId: 'file_008', versionNumber: 5, modifiedAt: '2026-10-30T17:00:00', storageUnitId: f008_cur_su.id, isCurrent: true, note: 'Versión final aprobada v5', status: 'active' }
  );

  // FILE-009: Latest approved budget
  const f009_su = addStorageUnit('su_f009', 15_000_000, 'drive-file', 'active', 'file_009');
  driveFiles.push({
    id: 'file_009',
    name: 'Presupuesto_Aprobado_Jornadas_2026_FIRMADO.xlsx',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'sheets',
    folderId: getFolderId('Proyectos'), // can be moved to Presupuestos
    createdAt: '2026-10-28T12:00:00',
    modifiedAt: '2026-11-04T16:00:00',
    currentVersionId: 'ver_f009',
    versionIds: ['ver_f009'],
    storageUnitId: f009_su.id,
    shared: false,
    favorite: false,
    tags: ['presupuesto', 'firmado'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-009',
    status: 'active',
    descriptionPreview: 'Última versión del presupuesto aprobado con firmas del vicerrector.',
  });
  fileVersions.push({
    id: 'ver_f009',
    fileId: 'file_009',
    versionNumber: 1,
    modifiedAt: '2026-11-04T16:00:00',
    storageUnitId: f009_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-010: Temp logs zip from closed test
  const f010_su = addStorageUnit('su_f010', 210_000_000, 'drive-file', 'active', 'file_010');
  driveFiles.push({
    id: 'file_010',
    name: 'logs_stress_test_septiembre_2026.tar.gz',
    extension: 'tar.gz',
    mimeType: 'application/gzip',
    category: 'compressed',
    folderId: getFolderId('Administración'),
    createdAt: '2026-09-30T23:59:00',
    modifiedAt: '2026-09-30T23:59:00',
    currentVersionId: 'ver_f010',
    versionIds: ['ver_f010'],
    storageUnitId: f010_su.id,
    shared: false,
    favorite: false,
    tags: ['logs', 'temporal'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-010',
    status: 'active',
    descriptionPreview: 'Paquete de logs temporales de pruebas de carga ya concluidas.',
  });
  fileVersions.push({
    id: 'ver_f010',
    fileId: 'file_010',
    versionNumber: 1,
    modifiedAt: '2026-09-30T23:59:00',
    storageUnitId: f010_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-011: Two identical PDFs with different names; one heavy scan, one OCR validated
  const f011_can_su = addStorageUnit('su_f011_can', 6_000_000, 'drive-file', 'active', 'file_011_can');
  driveFiles.push({
    id: 'file_011_can',
    name: 'Estatutos_Oficiales_Comision_OCR.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Actas'),
    createdAt: '2026-08-15T10:00:00',
    modifiedAt: '2026-08-15T10:00:00',
    currentVersionId: 'ver_f011_can',
    versionIds: ['ver_f011_can'],
    storageUnitId: f011_can_su.id,
    shared: true,
    favorite: false,
    tags: ['ocr', 'validado'],
    duplicateGroupId: 'dup_grp_f011',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-011',
    status: 'active',
    descriptionPreview: 'Versión optimizada con OCR, texto seleccionable y tamaño reducido.',
  });
  fileVersions.push({
    id: 'ver_f011_can',
    fileId: 'file_011_can',
    versionNumber: 1,
    modifiedAt: '2026-08-15T10:00:00',
    storageUnitId: f011_can_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f011_dup_su = addStorageUnit('su_f011_dup', 140_000_000, 'drive-file', 'active', 'file_011_dup');
  driveFiles.push({
    id: 'file_011_dup',
    name: 'SCAN_20260815_001_raw.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Administración'),
    createdAt: '2026-08-15T09:30:00',
    modifiedAt: '2026-08-15T09:30:00',
    currentVersionId: 'ver_f011_dup',
    versionIds: ['ver_f011_dup'],
    storageUnitId: f011_dup_su.id,
    shared: false,
    favorite: false,
    tags: ['escaneo pesado', 'redundante'],
    duplicateGroupId: 'dup_grp_f011',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-011',
    status: 'active',
    descriptionPreview: 'Escaneo pesado sin comprimir del mismo documento.',
  });
  fileVersions.push({
    id: 'ver_f011_dup',
    fileId: 'file_011_dup',
    versionNumber: 1,
    modifiedAt: '2026-08-15T09:30:00',
    storageUnitId: f011_dup_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-012: Repeated PNG exports vs editable source
  const f012_src_su = addStorageUnit('su_f012_src', 85_000_000, 'drive-file', 'active', 'file_012_src');
  driveFiles.push({
    id: 'file_012_src',
    name: 'Cartel_Oficial_Jornadas_Editable.psd',
    extension: 'psd',
    mimeType: 'image/vnd.adobe.photoshop',
    category: 'images',
    folderId: getFolderId('Comunicación'),
    createdAt: '2026-10-01T12:00:00',
    modifiedAt: '2026-10-10T15:00:00',
    currentVersionId: 'ver_f012_src',
    versionIds: ['ver_f012_src'],
    storageUnitId: f012_src_su.id,
    shared: true,
    favorite: true,
    tags: ['editable', 'fuente'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-012',
    status: 'active',
    descriptionPreview: 'Archivo original editable con todas las capas.',
  });
  fileVersions.push({
    id: 'ver_f012_src',
    fileId: 'file_012_src',
    versionNumber: 1,
    modifiedAt: '2026-10-10T15:00:00',
    storageUnitId: f012_src_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f012_png1_su = addStorageUnit('su_f012_png1', 48_000_000, 'drive-file', 'active', 'file_012_png1');
  driveFiles.push({
    id: 'file_012_png1',
    name: 'export_cartel_borrador_1.png',
    extension: 'png',
    mimeType: 'image/png',
    category: 'images',
    folderId: getFolderId('Comunicación'),
    createdAt: '2026-10-02T10:00:00',
    modifiedAt: '2026-10-02T10:00:00',
    currentVersionId: 'ver_f012_png1',
    versionIds: ['ver_f012_png1'],
    storageUnitId: f012_png1_su.id,
    shared: false,
    favorite: false,
    tags: ['exportación', 'redundante'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-012',
    status: 'active',
    descriptionPreview: 'Exportación intermedia descartada.',
  });
  fileVersions.push({
    id: 'ver_f012_png1',
    fileId: 'file_012_png1',
    versionNumber: 1,
    modifiedAt: '2026-10-02T10:00:00',
    storageUnitId: f012_png1_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f012_png2_su = addStorageUnit('su_f012_png2', 48_000_000, 'drive-file', 'active', 'file_012_png2');
  driveFiles.push({
    id: 'file_012_png2',
    name: 'export_cartel_borrador_2.png',
    extension: 'png',
    mimeType: 'image/png',
    category: 'images',
    folderId: getFolderId('Comunicación'),
    createdAt: '2026-10-05T11:00:00',
    modifiedAt: '2026-10-05T11:00:00',
    currentVersionId: 'ver_f012_png2',
    versionIds: ['ver_f012_png2'],
    storageUnitId: f012_png2_su.id,
    shared: false,
    favorite: false,
    tags: ['exportación', 'redundante'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-012',
    status: 'active',
    descriptionPreview: 'Segunda exportación intermedia descartada.',
  });
  fileVersions.push({
    id: 'ver_f012_png2',
    fileId: 'file_012_png2',
    versionNumber: 1,
    modifiedAt: '2026-10-05T11:00:00',
    storageUnitId: f012_png2_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-013: ZIP with sole original event photos
  const f013_su = addStorageUnit('su_f013', 550_000_000, 'drive-file', 'active', 'file_013');
  driveFiles.push({
    id: 'file_013',
    name: 'Fotos_Originales_Jornadas_2024_ArchivoUnico.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'compressed',
    folderId: getFolderId('Fotografías'),
    createdAt: '2024-11-20T16:00:00',
    modifiedAt: '2024-11-20T16:00:00',
    currentVersionId: 'ver_f013',
    versionIds: ['ver_f013'],
    storageUnitId: f013_su.id,
    shared: false,
    favorite: true,
    tags: ['archivo único', 'fotos'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-013',
    status: 'active',
    descriptionPreview: 'Único paquete de fotografías originales del evento 2024.',
  });
  fileVersions.push({
    id: 'ver_f013',
    fileId: 'file_013',
    versionNumber: 1,
    modifiedAt: '2024-11-20T16:00:00',
    storageUnitId: f013_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-014: Heavy video to share with team
  const f014_su = addStorageUnit('su_f014', 1_200_000_000, 'drive-file', 'active', 'file_014');
  driveFiles.push({
    id: 'file_014',
    name: 'Video_Promocional_Jornadas_4K.mp4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    category: 'videos',
    folderId: getFolderId('Vídeos'),
    createdAt: '2026-10-18T14:00:00',
    modifiedAt: '2026-10-18T14:00:00',
    currentVersionId: 'ver_f014',
    versionIds: ['ver_f014'],
    storageUnitId: f014_su.id,
    shared: false, // user should create share link!
    favorite: false,
    tags: ['vídeo pesado', 'promoción'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-014',
    status: 'active',
    descriptionPreview: 'Vídeo promocional en alta resolución. Compartir mediante enlace para evitar adjuntos.',
  });
  fileVersions.push({
    id: 'ver_f014',
    fileId: 'file_014',
    versionNumber: 1,
    modifiedAt: '2026-10-18T14:00:00',
    storageUnitId: f014_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-015: Duplicate audio, one corrupt, one valid
  const f015_val_su = addStorageUnit('su_f015_val', 65_000_000, 'drive-file', 'active', 'file_015_val');
  driveFiles.push({
    id: 'file_015_val',
    name: 'Entrevista_Radio_Sostenibilidad_Valida.mp3',
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    category: 'audio',
    folderId: getFolderId('Multimedia'),
    createdAt: '2026-10-12T11:00:00',
    modifiedAt: '2026-10-12T11:00:00',
    currentVersionId: 'ver_f015_val',
    versionIds: ['ver_f015_val'],
    storageUnitId: f015_val_su.id,
    shared: false,
    favorite: false,
    tags: ['audio', 'válido'],
    duplicateGroupId: 'dup_grp_f015',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-015',
    status: 'active',
    descriptionPreview: 'Grabación de audio correcta y verificada.',
  });
  fileVersions.push({
    id: 'ver_f015_val',
    fileId: 'file_015_val',
    versionNumber: 1,
    modifiedAt: '2026-10-12T11:00:00',
    storageUnitId: f015_val_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f015_cor_su = addStorageUnit('su_f015_cor', 65_000_000, 'drive-file', 'active', 'file_015_cor');
  driveFiles.push({
    id: 'file_015_cor',
    name: 'Entrevista_Radio_Sostenibilidad_Dañada.mp3',
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    category: 'audio',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-12T11:05:00',
    modifiedAt: '2026-10-12T11:05:00',
    currentVersionId: 'ver_f015_cor',
    versionIds: ['ver_f015_cor'],
    storageUnitId: f015_cor_su.id,
    shared: false,
    favorite: false,
    tags: ['audio', 'corrupto'],
    duplicateGroupId: 'dup_grp_f015',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-015',
    status: 'active',
    descriptionPreview: 'Copia corrupta de la entrevista que no reproduce sonido.',
  });
  fileVersions.push({
    id: 'ver_f015_cor',
    fileId: 'file_015_cor',
    versionNumber: 1,
    modifiedAt: '2026-10-12T11:05:00',
    storageUnitId: f015_cor_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-016: Confidential file with public link ("anyone-with-link")
  const f016_su = addStorageUnit('su_f016', 12_000_000, 'drive-file', 'active', 'file_016');
  driveFiles.push({
    id: 'file_016',
    name: 'Nominas_Y_Contratos_Internos_Confidencial.xlsx',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'sheets',
    folderId: getFolderId('Recursos Humanos'),
    createdAt: '2026-10-01T09:00:00',
    modifiedAt: '2026-11-01T10:00:00',
    currentVersionId: 'ver_f016',
    versionIds: ['ver_f016'],
    storageUnitId: f016_su.id,
    shared: true,
    shareLink: {
      id: 'link_f016',
      driveFileId: 'file_016',
      url: 'https://onedrive.sim/s/confidential-open-link-public',
      createdAt: '2026-10-01T09:00:00',
      access: 'anyone-with-link', // needs to be updated to 'people-in-org' or 'specific-people'
    },
    favorite: false,
    tags: ['confidencial', 'rrhh'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-016',
    status: 'active',
    descriptionPreview: 'Archivo confidencial expuesto por error con enlace público.',
  });
  fileVersions.push({
    id: 'ver_f016',
    fileId: 'file_016',
    versionNumber: 1,
    modifiedAt: '2026-11-01T10:00:00',
    storageUnitId: f016_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-017: Old share link to closed campaign; file to be kept
  const f017_su = addStorageUnit('su_f017', 22_000_000, 'drive-file', 'active', 'file_017');
  driveFiles.push({
    id: 'file_017',
    name: 'Memoria_Campaña_Navidad_2023.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Archivo histórico'),
    createdAt: '2024-01-15T10:00:00',
    modifiedAt: '2024-01-15T10:00:00',
    currentVersionId: 'ver_f017',
    versionIds: ['ver_f017'],
    storageUnitId: f017_su.id,
    shared: true,
    shareLink: {
      id: 'link_f017',
      driveFileId: 'file_017',
      url: 'https://onedrive.sim/s/campana-navidad-old-shared',
      createdAt: '2024-01-15T10:00:00',
      access: 'anyone-with-link',
    },
    favorite: false,
    tags: ['histórico', 'enlace activo'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-017',
    status: 'active',
    descriptionPreview: 'Enlace compartido obsoleto a una campaña finalizada. Revocar el enlace pero conservar el documento.',
  });
  fileVersions.push({
    id: 'ver_f017',
    fileId: 'file_017',
    versionNumber: 1,
    modifiedAt: '2024-01-15T10:00:00',
    storageUnitId: f017_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-018: Project folder with final version and two large temp copies
  const f018_fin_su = addStorageUnit('su_f018_fin', 55_000_000, 'drive-file', 'active', 'file_018_fin');
  driveFiles.push({
    id: 'file_018_fin',
    name: 'Dossier_Final_Patrocinadores_2026.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-15T10:00:00',
    modifiedAt: '2026-10-25T12:00:00',
    currentVersionId: 'ver_f018_fin',
    versionIds: ['ver_f018_fin'],
    storageUnitId: f018_fin_su.id,
    shared: true,
    favorite: false,
    tags: ['dossier final'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-018',
    status: 'active',
    descriptionPreview: 'Dossier final para patrocinadores que debe trasladarse a Archivo histórico.',
  });
  fileVersions.push({
    id: 'ver_f018_fin',
    fileId: 'file_018_fin',
    versionNumber: 1,
    modifiedAt: '2026-10-25T12:00:00',
    storageUnitId: f018_fin_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f018_tmp1_su = addStorageUnit('su_f018_tmp1', 95_000_000, 'drive-file', 'active', 'file_018_tmp1');
  driveFiles.push({
    id: 'file_018_tmp1',
    name: 'Dossier_TMP_version_borrador_pesado.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-10T11:00:00',
    modifiedAt: '2026-10-10T11:00:00',
    currentVersionId: 'ver_f018_tmp1',
    versionIds: ['ver_f018_tmp1'],
    storageUnitId: f018_tmp1_su.id,
    shared: false,
    favorite: false,
    tags: ['temporal', 'prescindible'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-018',
    status: 'active',
    descriptionPreview: 'Copia temporal pesada del dossier.',
  });
  fileVersions.push({
    id: 'ver_f018_tmp1',
    fileId: 'file_018_tmp1',
    versionNumber: 1,
    modifiedAt: '2026-10-10T11:00:00',
    storageUnitId: f018_tmp1_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f018_tmp2_su = addStorageUnit('su_f018_tmp2', 95_000_000, 'drive-file', 'active', 'file_018_tmp2');
  driveFiles.push({
    id: 'file_018_tmp2',
    name: 'Dossier_TMP_revision_imagenes_sin_comprimir.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-12T14:00:00',
    modifiedAt: '2026-10-12T14:00:00',
    currentVersionId: 'ver_f018_tmp2',
    versionIds: ['ver_f018_tmp2'],
    storageUnitId: f018_tmp2_su.id,
    shared: false,
    favorite: false,
    tags: ['temporal', 'prescindible'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-018',
    status: 'active',
    descriptionPreview: 'Segunda copia temporal sin comprimir.',
  });
  fileVersions.push({
    id: 'ver_f018_tmp2',
    fileId: 'file_018_tmp2',
    versionNumber: 1,
    modifiedAt: '2026-10-12T14:00:00',
    storageUnitId: f018_tmp2_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-019: Temp editing videos (final published, source saved)
  const f019_tmp_su = addStorageUnit('su_f019_tmp', 750_000_000, 'drive-file', 'active', 'file_019_tmp');
  driveFiles.push({
    id: 'file_019_tmp',
    name: 'Toma_Falsa_Previa_Edicion_01.mp4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    category: 'videos',
    folderId: getFolderId('Vídeos'),
    createdAt: '2026-10-20T16:00:00',
    modifiedAt: '2026-10-20T16:00:00',
    currentVersionId: 'ver_f019_tmp',
    versionIds: ['ver_f019_tmp'],
    storageUnitId: f019_tmp_su.id,
    shared: false,
    favorite: false,
    tags: ['vídeo temporal', 'descarte'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-019',
    status: 'active',
    descriptionPreview: 'Toma descartada de rodaje; el vídeo final ya está publicado.',
  });
  fileVersions.push({
    id: 'ver_f019_tmp',
    fileId: 'file_019_tmp',
    versionNumber: 1,
    modifiedAt: '2026-10-20T16:00:00',
    storageUnitId: f019_tmp_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-020: Old local backup verified in cloud
  const f020_loc_su = addStorageUnit('su_f020_loc', 380_000_000, 'drive-file', 'active', 'file_020_loc');
  driveFiles.push({
    id: 'file_020_loc',
    name: 'Backup_Local_Informes_2024.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'compressed',
    folderId: getFolderId('Administración'),
    createdAt: '2024-12-30T10:00:00',
    modifiedAt: '2024-12-30T10:00:00',
    currentVersionId: 'ver_f020_loc',
    versionIds: ['ver_f020_loc'],
    storageUnitId: f020_loc_su.id,
    shared: false,
    favorite: false,
    tags: ['backup local', 'duplicado'],
    duplicateGroupId: 'dup_grp_f020',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-020',
    status: 'active',
    descriptionPreview: 'Copia local redundante; idéntica a la copia oficial verificada en la nube.',
  });
  fileVersions.push({
    id: 'ver_f020_loc',
    fileId: 'file_020_loc',
    versionNumber: 1,
    modifiedAt: '2024-12-30T10:00:00',
    storageUnitId: f020_loc_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f020_cld_su = addStorageUnit('su_f020_cld', 380_000_000, 'drive-file', 'active', 'file_020_cld');
  driveFiles.push({
    id: 'file_020_cld',
    name: 'Backup_Nube_Verificado_Informes_2024.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'compressed',
    folderId: getFolderId('Archivo histórico'),
    createdAt: '2024-12-30T10:00:00',
    modifiedAt: '2024-12-30T10:00:00',
    currentVersionId: 'ver_f020_cld',
    versionIds: ['ver_f020_cld'],
    storageUnitId: f020_cld_su.id,
    shared: true,
    favorite: false,
    tags: ['backup nube', 'canónico'],
    duplicateGroupId: 'dup_grp_f020',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-020',
    status: 'active',
    descriptionPreview: 'Copia oficial verificada en OneDrive.',
  });
  fileVersions.push({
    id: 'ver_f020_cld',
    fileId: 'file_020_cld',
    versionNumber: 1,
    modifiedAt: '2024-12-30T10:00:00',
    storageUnitId: f020_cld_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-021: Unique project backup with note "no eliminar"
  const f021_su = addStorageUnit('su_f021', 490_000_000, 'drive-file', 'active', 'file_021');
  driveFiles.push({
    id: 'file_021',
    name: 'Backup_Proyecto_Biofilia_UNICO_NO_ELIMINAR.tar.gz',
    extension: 'tar.gz',
    mimeType: 'application/gzip',
    category: 'compressed',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-06-15T12:00:00',
    modifiedAt: '2026-06-15T12:00:00',
    currentVersionId: 'ver_f021',
    versionIds: ['ver_f021'],
    storageUnitId: f021_su.id,
    shared: false,
    favorite: true,
    tags: ['único', 'no eliminar'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-021',
    status: 'active',
    descriptionPreview: 'Copia de respaldo única del proyecto Biofilia. No tiene réplica en la nube.',
  });
  fileVersions.push({
    id: 'ver_f021',
    fileId: 'file_021',
    versionNumber: 1,
    modifiedAt: '2026-06-15T12:00:00',
    storageUnitId: f021_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-022: Five copies of same info PDF (signed is canonical)
  const f022_can_su = addStorageUnit('su_f022_can', 14_000_000, 'drive-file', 'active', 'file_022_can');
  driveFiles.push({
    id: 'file_022_can',
    name: 'Protocolo_Emergencias_Ambientales_Firmado.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Administración'),
    createdAt: '2026-09-01T10:00:00',
    modifiedAt: '2026-09-01T10:00:00',
    currentVersionId: 'ver_f022_can',
    versionIds: ['ver_f022_can'],
    storageUnitId: f022_can_su.id,
    shared: true,
    favorite: true,
    tags: ['canónico', 'firmado'],
    duplicateGroupId: 'dup_grp_f022',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-022',
    status: 'active',
    descriptionPreview: 'Protocolo canónico firmado por gerencia.',
  });
  fileVersions.push({
    id: 'ver_f022_can',
    fileId: 'file_022_can',
    versionNumber: 1,
    modifiedAt: '2026-09-01T10:00:00',
    storageUnitId: f022_can_su.id,
    isCurrent: true,
    status: 'active',
  });

  for (let d = 1; d <= 4; d++) {
    const f022_dup_su = addStorageUnit(`su_f022_dup${d}`, 14_000_000, 'drive-file', 'active', `file_022_dup${d}`);
    driveFiles.push({
      id: `file_022_dup${d}`,
      name: `Copia_${d}_Protocolo_Emergencias_Ambientales.pdf`,
      extension: 'pdf',
      mimeType: 'application/pdf',
      category: 'documents',
      folderId: driveFolders[d + 1].id,
      createdAt: '2026-09-02T10:00:00',
      modifiedAt: '2026-09-02T10:00:00',
      currentVersionId: `ver_f022_dup${d}`,
      versionIds: [`ver_f022_dup${d}`],
      storageUnitId: f022_dup_su.id,
      shared: false,
      favorite: false,
      tags: ['duplicado'],
      duplicateGroupId: 'dup_grp_f022',
      isCanonicalDuplicate: false,
      relatedMessageIds: [],
      scoringCaseId: 'FILE-022',
      status: 'active',
      descriptionPreview: `Copia redundante ${d} repartida en varias carpetas.`,
    });
    fileVersions.push({
      id: `ver_f022_dup${d}`,
      fileId: `file_022_dup${d}`,
      versionNumber: 1,
      modifiedAt: '2026-09-02T10:00:00',
      storageUnitId: f022_dup_su.id,
      isCurrent: true,
      status: 'active',
    });
  }

  // FILE-023: 300 MB ZIP attached repeatedly and also stored physically in OneDrive
  const f023_su = addStorageUnit('su_f023', 300_000_000, 'drive-file', 'active', 'file_023');
  driveFiles.push({
    id: 'file_023',
    name: 'Materiales_Graficos_Jornadas_300MB.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'compressed',
    folderId: getFolderId('Multimedia'),
    createdAt: '2026-10-10T09:00:00',
    modifiedAt: '2026-10-10T09:00:00',
    currentVersionId: 'ver_f023',
    versionIds: ['ver_f023'],
    storageUnitId: f023_su.id,
    shared: false,
    favorite: false,
    tags: ['archivo 300MB', 'adjunto frecuente'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-023',
    status: 'active',
    descriptionPreview: 'Paquete de 300 MB almacenado en la nube y reenviado como copia por correo.',
  });
  fileVersions.push({
    id: 'ver_f023',
    fileId: 'file_023',
    versionNumber: 1,
    modifiedAt: '2026-10-10T09:00:00',
    storageUnitId: f023_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-024: Recent doc with different name, but identical content to current final
  const f024_can_su = addStorageUnit('su_f024_can', 18_000_000, 'drive-file', 'active', 'file_024_can');
  driveFiles.push({
    id: 'file_024_can',
    name: 'Plan_Estrategico_Sostenibilidad_2026_2030_Final.docx',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    folderId: getFolderId('Proyectos'),
    createdAt: '2026-10-25T11:00:00',
    modifiedAt: '2026-10-25T11:00:00',
    currentVersionId: 'ver_f024_can',
    versionIds: ['ver_f024_can'],
    storageUnitId: f024_can_su.id,
    shared: true,
    favorite: true,
    tags: ['canónico', 'plan'],
    duplicateGroupId: 'dup_grp_f024',
    isCanonicalDuplicate: true,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-024',
    status: 'active',
    descriptionPreview: 'Documento oficial definitivo del plan estratégico.',
  });
  fileVersions.push({
    id: 'ver_f024_can',
    fileId: 'file_024_can',
    versionNumber: 1,
    modifiedAt: '2026-10-25T11:00:00',
    storageUnitId: f024_can_su.id,
    isCurrent: true,
    status: 'active',
  });

  const f024_dup_su = addStorageUnit('su_f024_dup', 18_000_000, 'drive-file', 'active', 'file_024_dup');
  driveFiles.push({
    id: 'file_024_dup',
    name: 'borrador_plan_ultimas_notas_equipo_nov.docx',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    folderId: getFolderId('Equipo de eventos'),
    createdAt: '2026-10-26T12:00:00',
    modifiedAt: '2026-10-26T12:00:00',
    currentVersionId: 'ver_f024_dup',
    versionIds: ['ver_f024_dup'],
    storageUnitId: f024_dup_su.id,
    shared: false,
    favorite: false,
    tags: ['duplicado con otro nombre'],
    duplicateGroupId: 'dup_grp_f024',
    isCanonicalDuplicate: false,
    relatedMessageIds: [],
    scoringCaseId: 'FILE-024',
    status: 'active',
    descriptionPreview: 'Contenido exactamente idéntico al plan final pero guardado con otro nombre.',
  });
  fileVersions.push({
    id: 'ver_f024_dup',
    fileId: 'file_024_dup',
    versionNumber: 1,
    modifiedAt: '2026-10-26T12:00:00',
    storageUnitId: f024_dup_su.id,
    isCurrent: true,
    status: 'active',
  });

  // FILE-025: Old signed doc still needed as evidence
  const f025_su = addStorageUnit('su_f025', 9_000_000, 'drive-file', 'active', 'file_025');
  driveFiles.push({
    id: 'file_025',
    name: 'Convenio_Marco_Colaboracion_2021_Firmado.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    folderId: getFolderId('Administración'), // should be moved to Archivo histórico
    createdAt: '2021-04-14T09:00:00',
    modifiedAt: '2021-04-14T09:00:00',
    currentVersionId: 'ver_f025',
    versionIds: ['ver_f025'],
    storageUnitId: f025_su.id,
    shared: false,
    favorite: false,
    tags: ['histórico', 'evidencia'],
    relatedMessageIds: [],
    scoringCaseId: 'FILE-025',
    status: 'active',
    descriptionPreview: 'Convenio antiguo que sirve como base jurídica para los proyectos actuales.',
  });
  fileVersions.push({
    id: 'ver_f025',
    fileId: 'file_025',
    versionNumber: 1,
    modifiedAt: '2021-04-14T09:00:00',
    storageUnitId: f025_su.id,
    isCurrent: true,
    status: 'active',
  });

  // We have mapped 25 files cases (with duplicates and versions).
  // Total Drive Files target: EXACTLY 120 files in 18 folders.
  // Breakdown target:
  // documents: 38
  // images: 22
  // videos: 14
  // audio: 10
  // sheets: 14
  // compressed: 12
  // other: 10
  // Sum = 120.

  // Count what we currently have:
  const catCount = (): Record<DriveFile['category'], number> => {
    const c: Record<DriveFile['category'], number> = {
      documents: 0,
      images: 0,
      videos: 0,
      audio: 0,
      sheets: 0,
      compressed: 0,
      other: 0,
    };
    for (const f of driveFiles) c[f.category]++;
    return c;
  };

  const targetCats: Record<DriveFile['category'], number> = {
    documents: 38,
    images: 22,
    videos: 14,
    audio: 10,
    sheets: 14,
    compressed: 12,
    other: 10,
  };

  // Populate remaining files up to exact target per category
  const categoriesList: DriveFile['category'][] = [
    'documents',
    'images',
    'videos',
    'audio',
    'sheets',
    'compressed',
    'other',
  ];

  for (const cat of categoriesList) {
    let current = catCount()[cat];
    let catIdx = 1;
    while (current < targetCats[cat]) {
      const fileId = `file_gen_${cat}_${catIdx.toString().padStart(2, '0')}`;
      let ext = 'pdf';
      let mime = 'application/pdf';
      let size = 5_000_000;
      let folderName = 'Documentos';

      if (cat === 'documents') {
        ext = catIdx % 2 === 0 ? 'docx' : 'pdf';
        mime = ext === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        size = 2_000_000 + (catIdx * 1_500_000);
        folderName = 'Informes';
      } else if (cat === 'images') {
        ext = catIdx % 2 === 0 ? 'png' : 'jpg';
        mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        size = 4_000_000 + (catIdx * 800_000);
        folderName = 'Fotografías';
      } else if (cat === 'videos') {
        ext = 'mp4';
        mime = 'video/mp4';
        size = 150_000_000 + (catIdx * 50_000_000);
        folderName = 'Vídeos';
      } else if (cat === 'audio') {
        ext = 'mp3';
        mime = 'audio/mpeg';
        size = 25_000_000 + (catIdx * 5_000_000);
        folderName = 'Multimedia';
      } else if (cat === 'sheets') {
        ext = catIdx % 2 === 0 ? 'xlsx' : 'pptx';
        mime = ext === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        size = 8_000_000 + (catIdx * 2_000_000);
        folderName = 'Presupuestos';
      } else if (cat === 'compressed') {
        ext = 'zip';
        mime = 'application/zip';
        size = 45_000_000 + (catIdx * 15_000_000);
        folderName = 'Proyectos';
      } else if (cat === 'other') {
        ext = catIdx % 2 === 0 ? 'iso' : 'log';
        mime = 'application/octet-stream';
        size = 12_000_000 + (catIdx * 6_000_000);
        folderName = 'Administración';
      }

      const assignedFolder = driveFolders[(driveFiles.length + catIdx) % driveFolders.length];
      const su = addStorageUnit(`su_${fileId}`, size, 'drive-file', 'active', fileId);

      driveFiles.push({
        id: fileId,
        name: `${cat.charAt(0).toUpperCase() + cat.slice(1)}_General_${catIdx}.${ext}`,
        extension: ext,
        mimeType: mime,
        category: cat,
        folderId: assignedFolder.id,
        createdAt: `2026-09-${((catIdx % 28) + 1).toString().padStart(2, '0')}T10:00:00`,
        modifiedAt: `2026-10-${((catIdx % 28) + 1).toString().padStart(2, '0')}T15:00:00`,
        currentVersionId: `ver_${fileId}`,
        versionIds: [`ver_${fileId}`],
        storageUnitId: su.id,
        shared: catIdx % 4 === 0,
        favorite: catIdx % 5 === 0,
        tags: [cat, assignedFolder.name],
        relatedMessageIds: [],
        status: 'active',
        descriptionPreview: `Fichero ${cat} en ${assignedFolder.name}.`,
      });

      fileVersions.push({
        id: `ver_${fileId}`,
        fileId,
        versionNumber: 1,
        modifiedAt: `2026-10-${((catIdx % 28) + 1).toString().padStart(2, '0')}T15:00:00`,
        storageUnitId: su.id,
        isCurrent: true,
        status: 'active',
      });

      catIdx++;
      current = catCount()[cat];
    }
  }

  // ----------------------------------------------------
  // 5. Mail Messages (Exactly 320 messages)
  // Target folder counts:
  // inbox: 180
  // sent: 55
  // drafts: 12
  // archive & subfolders: 35
  // junk: 12
  // trash: 26
  // Sum = 320.
  // ----------------------------------------------------
  const mailMessages: MailMessage[] = [];
  const mailAttachments: MailAttachment[] = [];

  // Mapped messages for MAIL-001 to MAIL-030
  // MAIL-001: Old weekly newsletter repeated multiple times, no archival value
  const m001_body_su = addStorageUnit('su_m001_b', 18_000, 'mail-body', 'active', 'msg_mail001');
  mailMessages.push({
    id: 'msg_mail001',
    threadId: 'th_mail001',
    folderId: 'inbox',
    senderContactId: contacts[10].id,
    senderNameSnapshot: 'Boletín de Sostenibilidad Semanal',
    senderEmailSnapshot: 'boletin-sostenible@servicios.us.example',
    to: [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
    cc: [],
    subject: 'Boletín Semanal #42 · Resumen de noticias pasadas (Septiembre 2024)',
    body: 'Este boletín semanal fue enviado hace más de dos años con enlaces temporales y avisos ya expirados. No contiene documentación oficial ni acuerdos.',
    preview: 'Resumen semanal de noticias y avisos ya caducados de septiembre 2024...',
    sentAt: '2024-09-15T08:00:00',
    receivedAt: '2024-09-15T08:01:00',
    read: true,
    starred: false,
    important: false,
    categories: ['Boletines'],
    attachmentIds: [],
    linkedFileIds: [],
    bodyStorageUnitId: m001_body_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-001',
    status: 'active',
  });

  // MAIL-002: Administrative enrollment notice, closed, should be kept as historical receipt
  const m002_body_su = addStorageUnit('su_m002_b', 24_000, 'mail-body', 'active', 'msg_mail002');
  mailMessages.push({
    id: 'msg_mail002',
    threadId: 'th_mail002',
    folderId: 'inbox',
    senderContactId: contacts[2].id,
    senderNameSnapshot: 'Secretaría de Alumnos',
    senderEmailSnapshot: 'secretaria.alumnos@us.example',
    to: [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
    cc: [],
    subject: 'Justificante oficial de matrícula y exención de tasas 2025/2026',
    body: 'Estimado alumno, adjuntamos la resolución definitiva del expediente de matrícula con la exención de tasas aplicada. Consérvese como justificante para posibles auditorías de becas.',
    preview: 'Resolución definitiva del expediente de matrícula con exención de tasas...',
    sentAt: '2025-10-10T11:20:00',
    receivedAt: '2025-10-10T11:21:00',
    read: true,
    starred: false,
    important: true,
    categories: ['Administración', 'Justificantes'],
    attachmentIds: [],
    linkedFileIds: [],
    bodyStorageUnitId: m002_body_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-002',
    status: 'active',
  });

  // MAIL-003: Conversation with 5 replies repeating same PDF; canonical in OneDrive
  const m003_att_su = addStorageUnit('su_m003_att', 18_000_000, 'mail-attachment', 'active', 'msg_mail003_dup');
  const m003_body1_su = addStorageUnit('su_m003_b1', 15_000, 'mail-body', 'active', 'msg_mail003_can');
  const m003_body2_su = addStorageUnit('su_m003_b2', 15_000, 'mail-body', 'active', 'msg_mail003_dup');

  mailMessages.push({
    id: 'msg_mail003_can',
    threadId: 'th_mail003',
    folderId: 'inbox',
    senderContactId: contacts[7].id,
    senderNameSnapshot: 'Dra. Carmen Soler',
    senderEmailSnapshot: 'carmen.soler@us.example',
    to: [{ displayName: 'Equipo Jornadas', email: 'jornadas-equipo@us.example' }],
    cc: [],
    subject: 'Re: Re: Re: Programa provisional de las Jornadas 2026 (Acuerdo final)',
    body: 'Acuerdo definitivo sobre el programa. La versión canónica está alojada y actualizada en OneDrive.',
    preview: 'Acuerdo definitivo sobre el programa. La versión canónica está en OneDrive...',
    sentAt: '2026-11-03T16:45:00',
    receivedAt: '2026-11-03T16:46:00',
    read: true,
    starred: false,
    important: true,
    categories: ['Jornadas'],
    attachmentIds: [],
    linkedFileIds: ['file_001_can'],
    bodyStorageUnitId: m003_body1_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-003',
    status: 'active',
  });

  mailMessages.push({
    id: 'msg_mail003_dup',
    threadId: 'th_mail003',
    folderId: 'inbox',
    senderContactId: contacts[1].id,
    senderNameSnapshot: 'Marcos Ruiz',
    senderEmailSnapshot: 'm.ruiz@us.example',
    to: [{ displayName: 'Equipo Jornadas', email: 'jornadas-equipo@us.example' }],
    cc: [],
    subject: 'Re: Programa provisional de las Jornadas 2026 (Copia pesada adjunta)',
    body: 'Adjunto de nuevo el PDF completo de 18 MB por si alguien no podía abrir el enlace anterior.',
    preview: 'Adjunto de nuevo el PDF completo de 18 MB por si alguien no podía abrir...',
    sentAt: '2026-11-02T10:15:00',
    receivedAt: '2026-11-02T10:16:00',
    read: true,
    starred: false,
    important: false,
    categories: ['Jornadas'],
    attachmentIds: ['att_m003'],
    linkedFileIds: [],
    bodyStorageUnitId: m003_body2_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-003',
    status: 'active',
  });
  mailAttachments.push({
    id: 'att_m003',
    messageId: 'msg_mail003_dup',
    fileName: 'Programa_Provisional_Jornadas_Copia18MB.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 18_000_000,
    storageUnitId: m003_att_su.id,
    isLink: false,
  });

  // MAIL-004: Duplicate invoice in two emails; one has approval thread and must remain
  const m004_att1_su = addStorageUnit('su_m004_att1', 4_500_000, 'mail-attachment', 'active', 'msg_mail004_val');
  const m004_att2_su = addStorageUnit('su_m004_att2', 4_500_000, 'mail-attachment', 'active', 'msg_mail004_dup');
  const m004_b1_su = addStorageUnit('su_m004_b1', 12_000, 'mail-body', 'active', 'msg_mail004_val');
  const m004_b2_su = addStorageUnit('su_m004_b2', 12_000, 'mail-body', 'active', 'msg_mail004_dup');

  mailMessages.push({
    id: 'msg_mail004_val',
    threadId: 'th_mail004',
    folderId: 'inbox',
    senderContactId: contacts[13].id,
    senderNameSnapshot: 'Pilar Domínguez',
    senderEmailSnapshot: 'p.dominguez@us.example',
    to: [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
    cc: [{ displayName: 'Intervención General', email: 'intervencion@us.example' }],
    subject: 'Factura F-2026-881 Reprografía [Aprobada por Gerencia]',
    body: 'Se incluye la firma de conformidad del vicerrector y el visto bueno de intervención para el pago.',
    preview: 'Se incluye la firma de conformidad del vicerrector y el visto bueno...',
    sentAt: '2026-10-22T12:30:00',
    receivedAt: '2026-10-22T12:31:00',
    read: true,
    starred: false,
    important: true,
    categories: ['Facturación', 'Aprobado'],
    attachmentIds: ['att_m004_val'],
    linkedFileIds: [],
    bodyStorageUnitId: m004_b1_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-004',
    status: 'active',
  });
  mailAttachments.push({
    id: 'att_m004_val',
    messageId: 'msg_mail004_val',
    fileName: 'Factura_F2026_881_ConAprobacion.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4_500_000,
    storageUnitId: m004_att1_su.id,
    isLink: false,
  });

  mailMessages.push({
    id: 'msg_mail004_dup',
    threadId: 'th_mail004_dup',
    folderId: 'inbox',
    senderContactId: contacts[6].id,
    senderNameSnapshot: 'Gráficas Sur SL',
    senderEmailSnapshot: 'contacto@graficassur.example',
    to: [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
    cc: [],
    subject: 'Envío automático: Factura F-2026-881 (Sin aprobación)',
    body: 'Envío rutinario del fichero sin firmas ni hilo de tramitación interna.',
    preview: 'Envío rutinario del fichero sin firmas ni hilo de tramitación...',
    sentAt: '2026-10-22T08:00:00',
    receivedAt: '2026-10-22T08:01:00',
    read: true,
    starred: false,
    important: false,
    categories: ['Facturación'],
    attachmentIds: ['att_m004_dup'],
    linkedFileIds: [],
    bodyStorageUnitId: m004_b2_su.id,
    isJunk: false,
    scoringCaseId: 'MAIL-004',
    status: 'active',
  });
  mailAttachments.push({
    id: 'att_m004_dup',
    messageId: 'msg_mail004_dup',
    fileName: 'Factura_F2026_881_Borrador.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4_500_000,
    storageUnitId: m004_att2_su.id,
    isLink: false,
  });

  // Populate remaining MAIL cases (MAIL-005 to MAIL-030)
  const remainingMailCases = [
    { id: 'MAIL-005', subj: 'Recibo único de pago de tasas congreso 2026', folder: 'inbox', imp: true, body: 'Recibo oficial bancario con número de operación para justificar ante auditoría.' },
    { id: 'MAIL-006', subj: 'Cadena publicitaria antigua ofertas vuelos 2023', folder: 'inbox', imp: false, body: 'Promoción comercial sin valor de una agencia de viajes caducada.' },
    { id: 'MAIL-007', subj: 'Borrador: Vídeo explicativo de acogida para nuevos alumnos', folder: 'drafts', imp: true, body: 'Borrador importante con adjunto pesado que ya existe en OneDrive.' },
    { id: 'MAIL-008', subj: 'Datos preliminares de muestra de suelo no volcados al servidor', folder: 'inbox', imp: true, body: 'Adjunto con resultados únicos de laboratorio aún no subidos a OneDrive.' },
    { id: 'MAIL-009', subj: 'URGENTE: Verifique su contraseña de acceso institucional de inmediato', folder: 'inbox', imp: false, body: 'Correo fraudulento simulando soporte técnico solicitando credenciales en enlace externo.' },
    { id: 'MAIL-010', subj: 'Presupuesto formal de papelería reciclada para el centro', folder: 'junk', imp: false, body: 'Presupuesto legítimo del proveedor que ha entrado por error en no deseado.' },
    { id: 'MAIL-011', subj: 'Convocatoria con plazo de alegaciones que finaliza mañana a las 14h', folder: 'inbox', imp: true, body: 'Resolución provisional con plazo de respuesta activo, pendiente de revisión.' },
    { id: 'MAIL-012', subj: 'Cancelación formal: Comisión de Sostenibilidad del 28 de octubre', folder: 'inbox', imp: false, body: 'Aviso de reunión cancelada en su día. Puede archivarse para registro.' },
    { id: 'MAIL-013', subj: 'Borrador descartado de campaña redes verano 2024', folder: 'drafts', imp: false, body: 'Campaña cancelada sin contenidos útiles ni texto aprovechable.' },
    { id: 'MAIL-014', subj: 'Borrador en curso: Propuesta de decálogo ambiental para campus', folder: 'drafts', imp: true, body: 'Texto original de trabajo aún en redacción que debe conservarse.' },
    { id: 'MAIL-015', subj: 'Borrador: Envío masivo de presentación institucional de 80 MB', folder: 'drafts', imp: false, body: 'Contiene presentación pesada que debe enviarse como enlace de OneDrive.' },
    { id: 'MAIL-016', subj: 'Actualización obligatoria de política de prevención de riesgos laborales', folder: 'inbox', imp: true, body: 'Circular de RR.HH. vigente con enlace a normativa oficial.' },
    { id: 'MAIL-017', subj: 'Avisos automáticos de servidor Moodle de pruebas 2022', folder: 'inbox', imp: false, body: 'Alertas automáticas de un servidor de pruebas desmantelado hace años.' },
    { id: 'MAIL-018', subj: 'Acta oficial firmada de la sesión constitutiva del comité', folder: 'inbox', imp: true, body: 'Documento legal probatorio con firma digital de los miembros fundadores.' },
    { id: 'MAIL-019', subj: 'Envío de fotografías del campus (ya catalogadas en OneDrive)', folder: 'inbox', imp: false, body: 'Las fotografías de este correo ya fueron verificadas y archivadas en OneDrive.' },
    { id: 'MAIL-020', subj: 'Re: Acuerdo final sobre el manifiesto por el clima 2026', folder: 'inbox', imp: true, body: 'Último correo de un hilo de 18 mensajes con el texto del acuerdo definitivo.' },
    { id: 'MAIL-021', subj: 'Invitación oficial: Inauguración de las Jornadas de Sostenibilidad', folder: 'inbox', imp: true, body: 'Invitación a evento futuro vigente con enlace al streaming y orden del día.' },
    { id: 'MAIL-022', subj: 'Notificación automática repetitiva de sincronización correcta', folder: 'inbox', imp: false, body: 'Aviso del sistema generado cada 10 minutos sin valor de registro.' },
    { id: 'MAIL-023', subj: 'Confirmación y localizador de reserva de sala de conferencias', folder: 'inbox', imp: false, body: 'Reserva completada satisfactoriamente cuyo justificante conviene archivar.' },
    { id: 'MAIL-024', subj: 'Copia duplicada de informe de emisiones 2025 (Original en Archivo)', folder: 'inbox', imp: false, body: 'Duplicado de gran tamaño cuyo original ya se encuentra en Archivados.' },
    { id: 'MAIL-025', subj: 'Datos históricos de la estación meteorológica del campus (Estudio activo)', folder: 'inbox', imp: true, body: 'Mediciones históricas que forman parte de una tesis en curso.' },
    { id: 'MAIL-026', subj: 'Oferta exclusiva: Actualice su paquete ofimático con este ejecutable', folder: 'inbox', imp: false, body: 'Mensaje sospechoso con fichero adjunto no verificado.' },
    { id: 'MAIL-027', subj: 'Alerta resuelta: Corte programado de agua de hace 6 meses', folder: 'inbox', imp: false, body: 'Notificación de obras ya finalizadas sin repercusión actual.' },
    { id: 'MAIL-028', subj: 'Coordinación urgente: Asignación de aulas para ponentes internacionales', folder: 'inbox', imp: true, body: 'Mensaje de la decana pendiente de contestación oculto entre muchos correos.' },
    { id: 'MAIL-029', subj: 'Presentación borrador con erratas de la ponencia inaugural', folder: 'inbox', imp: false, body: 'Versión previa sustituida por la presentación definitiva aprobada.' },
    { id: 'MAIL-030', subj: 'Justificante único de pago de tasas enviado a la papelera por error', folder: 'trash', imp: true, body: 'Documento probatorio crucial arrastrado por descuido a la papelera.' },
  ];

  for (const mcase of remainingMailCases) {
    const isUnread = mcase.id === 'MAIL-011' || mcase.id === 'MAIL-028';
    const bodySu = addStorageUnit(`su_${mcase.id}_b`, 20_000, 'mail-body', mcase.folder === 'trash' ? 'trash' : 'active', `msg_${mcase.id}`);
    const attIds: string[] = [];

    if (mcase.id === 'MAIL-007' || mcase.id === 'MAIL-015') {
      const attSu = addStorageUnit(`su_${mcase.id}_att`, 80_000_000, 'mail-attachment', 'active', `msg_${mcase.id}`);
      const attId = `att_${mcase.id}`;
      mailAttachments.push({
        id: attId,
        messageId: `msg_${mcase.id}`,
        fileName: mcase.id === 'MAIL-007' ? 'Video_Acogida_80MB.mp4' : 'Presentacion_Institucional_80MB.pptx',
        mimeType: mcase.id === 'MAIL-007' ? 'video/mp4' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        sizeBytes: 80_000_000,
        storageUnitId: attSu.id,
        isLink: false,
      });
      attIds.push(attId);
    }

    mailMessages.push({
      id: `msg_${mcase.id}`,
      threadId: `th_${mcase.id}`,
      folderId: mcase.folder,
      senderContactId: contacts[mailMessages.length % contacts.length].id,
      senderNameSnapshot: contacts[mailMessages.length % contacts.length].displayName,
      senderEmailSnapshot: contacts[mailMessages.length % contacts.length].email,
      to: [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
      cc: [],
      subject: mcase.subj,
      body: mcase.body,
      preview: mcase.body.slice(0, 75) + '...',
      sentAt: '2026-11-05T09:30:00',
      receivedAt: '2026-11-05T09:31:00',
      read: !isUnread,
      starred: false,
      important: mcase.imp,
      categories: ['Simulación'],
      attachmentIds: attIds,
      linkedFileIds: [],
      bodyStorageUnitId: bodySu.id,
      isJunk: mcase.folder === 'junk',
      scoringCaseId: mcase.id,
      status: mcase.folder === 'trash' ? 'trash' : 'active',
    });
  }

  // Count current mail folders
  const getFolderCounts = (): Record<string, number> => {
    const c: Record<string, number> = {
      inbox: 0,
      sent: 0,
      drafts: 0,
      archive: 0,
      junk: 0,
      trash: 0,
    };
    for (const m of mailMessages) {
      if (m.folderId.startsWith('archive')) {
        c.archive++;
      } else if (c[m.folderId] !== undefined) {
        c[m.folderId]++;
      }
    }
    return c;
  };

  // Required exact distributions:
  // inbox: 180
  // sent: 55
  // drafts: 12
  // archive (all): 35 (archive: 15, archive_admin: 5, archive_actas: 5, archive_informes: 5, archive_proyectos: 5)
  // junk: 12
  // trash: 26
  // Total: 320!

  const targetMails: Record<string, number> = {
    inbox: 180,
    sent: 55,
    drafts: 12,
    archive: 35,
    junk: 12,
    trash: 26,
  };

  const archiveSubfolders = [
    'archive',
    'archive_admin',
    'archive_actas',
    'archive_informes',
    'archive_proyectos',
  ];

  let genMsgIdx = 1;
  const foldersToFill = ['inbox', 'sent', 'drafts', 'archive', 'junk', 'trash'];

  for (const fKey of foldersToFill) {
    let currentCount = getFolderCounts()[fKey];
    while (currentCount < targetMails[fKey]) {
      const msgId = `msg_gen_${fKey}_${genMsgIdx.toString().padStart(3, '0')}`;
      let targetFolderId = fKey;
      if (fKey === 'archive') {
        targetFolderId = archiveSubfolders[currentCount % archiveSubfolders.length];
      }

      const isTrash = fKey === 'trash';
      const bodySu = addStorageUnit(`su_${msgId}_b`, 15_000, 'mail-body', isTrash ? 'trash' : 'active', msgId);

      const hasAtt = genMsgIdx % 4 === 0;
      const attIds: string[] = [];
      if (hasAtt) {
        const attId = `att_${msgId}`;
        const attSize = 3_000_000 + ((genMsgIdx % 10) * 1_000_000);
        const attSu = addStorageUnit(`su_${attId}`, attSize, 'mail-attachment', isTrash ? 'trash' : 'active', msgId);
        mailAttachments.push({
          id: attId,
          messageId: msgId,
          fileName: `Documento_Adjunto_${genMsgIdx}.pdf`,
          mimeType: 'application/pdf',
          sizeBytes: attSize,
          storageUnitId: attSu.id,
          isLink: false,
        });
        attIds.push(attId);
      }

      const senderContact = contacts[(genMsgIdx + mailMessages.length) % contacts.length];
      const isSent = fKey === 'sent';

      mailMessages.push({
        id: msgId,
        threadId: `th_gen_${genMsgIdx}`,
        folderId: targetFolderId,
        senderContactId: isSent ? 'user_current' : senderContact.id,
        senderNameSnapshot: isSent ? 'Raúl Jiménez' : senderContact.displayName,
        senderEmailSnapshot: isSent ? 'raul.jimenez@us.example' : senderContact.email,
        to: isSent ? [{ displayName: senderContact.displayName, email: senderContact.email }] : [{ displayName: 'Raúl Jiménez', email: 'raul.jimenez@us.example' }],
        cc: [],
        subject: `Comunicación ${fKey} #${genMsgIdx}: Gestión de sostenibilidad`,
        body: `Mensaje simulado correspondiente a la bandeja de ${fKey}. Contenido descriptivo del entorno universitario.`,
        preview: `Mensaje simulado correspondiente a la bandeja de ${fKey}...`,
        sentAt: `2026-10-${((genMsgIdx % 28) + 1).toString().padStart(2, '0')}T11:00:00`,
        receivedAt: isSent ? undefined : `2026-10-${((genMsgIdx % 28) + 1).toString().padStart(2, '0')}T11:01:00`,
        read: genMsgIdx % 3 !== 0,
        starred: genMsgIdx % 7 === 0,
        important: genMsgIdx % 11 === 0,
        categories: [fKey],
        attachmentIds: attIds,
        linkedFileIds: [],
        bodyStorageUnitId: bodySu.id,
        isJunk: fKey === 'junk',
        status: isTrash ? 'trash' : 'active',
      });

      genMsgIdx++;
      currentCount = getFolderCounts()[fKey];
    }
  }

  // ----------------------------------------------------
  // 6. Calendar Events (Already prepared in earlier step)
  // Let's ensure exactly 48 events!
  // ----------------------------------------------------
  const calendarEvents = buildCalendarEvents(contacts);

  // ----------------------------------------------------
  // 7. Scoring Cases (Exactly 73 cases)
  // MAIL-001 to MAIL-030 (30)
  // FILE-001 to FILE-025 (25)
  // CAL-001 to CAL-008 (8)
  // CON-001 to CON-010 (10)
  // ----------------------------------------------------
  const scoringCases = buildScoringCases();

  // ----------------------------------------------------
  // 8. Storage Calibration to EXACTLY 34.000.000.000 bytes!
  // ----------------------------------------------------
  calibrateStorageUnits(storageUnits, driveFiles, fileVersions);

  return {
    mailFolders,
    mailMessages,
    mailAttachments,
    driveFolders,
    driveFiles,
    fileVersions,
    contacts,
    calendarEvents,
    storageUnits,
    scoringCases,
  };
}

function buildCalendarEvents(contacts: Contact[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  events.push({
    id: 'evt_cal001',
    title: 'Seminario de Huella de Carbono (Cancelado)',
    description: 'El ponente canceló la asistencia por motivos médicos. Sigue apareciendo en tu calendario personal.',
    startAt: '2026-11-12T10:00:00',
    endAt: '2026-11-12T12:00:00',
    location: 'Aula Magna Biología',
    organizerContactId: contacts[5].id,
    attendeeContactIds: [contacts[0].id, contacts[4].id],
    currentUserRole: 'attendee',
    response: 'accepted',
    status: 'cancelled',
    linkedFileIds: [],
    scoringCaseId: 'CAL-001',
    removedFromPersonal: false,
  });

  events.push({
    id: 'evt_cal002_can',
    title: 'Revisión Presupuestos Jornadas (Notas definitivas)',
    description: 'Incluye acta de acuerdos finales y reparto de partidas presupuestarias aprobado.',
    startAt: '2026-11-11T16:00:00',
    endAt: '2026-11-11T17:30:00',
    location: 'Sala de Juntas 2',
    organizerContactId: contacts[4].id,
    attendeeContactIds: [contacts[13].id, contacts[10].id],
    currentUserRole: 'attendee',
    response: 'accepted',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-002',
  });

  events.push({
    id: 'evt_cal002_dup',
    title: 'Revisión Presupuestos Jornadas (Borrador inicial)',
    description: 'Copia duplicada anterior sin las notas definitivas.',
    startAt: '2026-11-11T16:00:00',
    endAt: '2026-11-11T17:30:00',
    location: 'Sala de Juntas 2',
    organizerContactId: contacts[4].id,
    attendeeContactIds: [contacts[13].id],
    currentUserRole: 'attendee',
    response: 'tentative',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-002',
  });

  events.push({
    id: 'evt_cal003',
    title: 'Comisión Permanente: Preparación Oficial Jornadas 2026',
    description: 'Reunión obligatoria con vicerrector y decanos para aprobar la programación oficial.',
    startAt: '2026-11-16T09:30:00',
    endAt: '2026-11-16T11:30:00',
    location: 'Rectorado - Salón de Carteles',
    organizerContactId: contacts[4].id,
    attendeeContactIds: [contacts[0].id, contacts[1].id, contacts[14].id],
    currentUserRole: 'attendee',
    response: 'none',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-003',
  });

  events.push({
    id: 'evt_cal004',
    title: 'Revisión semanal de fotocopiadoras (Pasada)',
    description: 'Reunión operativa rutinaria de hace dos meses sin actas ni acuerdos pendientes.',
    startAt: '2026-09-14T12:00:00',
    endAt: '2026-09-14T12:45:00',
    location: 'Despacho Auxiliar',
    organizerContactId: contacts[3].id,
    attendeeContactIds: [contacts[2].id],
    currentUserRole: 'attendee',
    response: 'accepted',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-004',
  });

  events.push({
    id: 'evt_cal005',
    title: 'Demostración de Nuevos Tóneres Ecológicos',
    description: 'Invitación comercial de un proveedor antiguo. Ya no gestionas compras de este centro.',
    startAt: '2026-11-13T13:00:00',
    endAt: '2026-11-13T14:00:00',
    location: 'Online - Teams',
    organizerContactId: contacts[3].id,
    attendeeContactIds: [],
    currentUserRole: 'attendee',
    response: 'none',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-005',
  });

  events.push({
    id: 'evt_cal006',
    title: 'Taller presencial de compostaje de oficina',
    description: 'El equipo acordó cancelar este taller por falta de inscripciones. Eres el organizador.',
    startAt: '2026-11-20T17:00:00',
    endAt: '2026-11-20T19:00:00',
    location: 'Jardín Botánico del Campus',
    organizerContactId: 'user_current',
    attendeeContactIds: [contacts[20].id, contacts[21].id, contacts[22].id],
    currentUserRole: 'organizer',
    response: 'accepted',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-006',
  });

  events.push({
    id: 'evt_cal007',
    seriesId: 'series_cal007',
    title: 'Seguimiento de obras en pabellón de deportes (Finalizado)',
    description: 'Las obras finalizaron en septiembre. La reunión recurrente semanal sigue activa en el calendario.',
    startAt: '2026-11-10T08:30:00',
    endAt: '2026-11-10T09:15:00',
    location: 'Sala de Obras',
    organizerContactId: 'user_current',
    attendeeContactIds: [contacts[6].id, contacts[7].id],
    currentUserRole: 'organizer',
    response: 'accepted',
    status: 'confirmed',
    recurrence: { frequency: 'weekly', count: 12 },
    linkedFileIds: [],
    scoringCaseId: 'CAL-007',
  });

  events.push({
    id: 'evt_cal008_series',
    seriesId: 'series_cal008',
    title: 'Comité semanal de coordinación TIC',
    description: 'Reunión semanal en curso para todos los técnicos del centro.',
    startAt: '2026-11-12T09:00:00',
    endAt: '2026-11-12T10:00:00',
    location: 'Seminario TIC 1',
    organizerContactId: contacts[5].id,
    attendeeContactIds: [contacts[0].id, contacts[1].id],
    currentUserRole: 'attendee',
    response: 'accepted',
    status: 'confirmed',
    recurrence: { frequency: 'weekly', count: 24 },
    linkedFileIds: [],
    scoringCaseId: 'CAL-008',
  });

  events.push({
    id: 'evt_cal008_dup_occ',
    seriesId: 'series_cal008',
    title: 'Comité semanal de coordinación TIC (Copia duplicada)',
    description: 'Ocurrencia aislada duplicada por error de sincronización.',
    startAt: '2026-11-12T09:00:00',
    endAt: '2026-11-12T10:00:00',
    location: 'Seminario TIC 1',
    organizerContactId: contacts[5].id,
    attendeeContactIds: [contacts[0].id],
    currentUserRole: 'attendee',
    response: 'accepted',
    status: 'confirmed',
    linkedFileIds: [],
    scoringCaseId: 'CAL-008',
  });

  const eventTemplates = [
    { title: 'Inauguración de curso académico 2026/27', start: '2026-10-02T11:00:00', end: '2026-10-02T13:00:00', status: 'confirmed' },
    { title: 'Reunión de departamento de Biología', start: '2026-10-08T09:30:00', end: '2026-10-08T11:00:00', status: 'confirmed' },
    { title: 'Claustro ordinario de otoño', start: '2026-10-15T10:00:00', end: '2026-10-15T14:00:00', status: 'confirmed' },
    { title: 'Taller de reciclaje de residuos electrónicos', start: '2026-10-21T16:00:00', end: '2026-10-21T18:00:00', status: 'confirmed' },
    { title: 'Presentación de proyectos fin de grado', start: '2026-10-28T09:00:00', end: '2026-10-28T13:00:00', status: 'confirmed' },
    { title: 'Auditoría interna de calidad ISO 14001', start: '2026-11-03T09:00:00', end: '2026-11-03T14:00:00', status: 'confirmed' },
    { title: 'Mesa redonda: Movilidad sostenible en Sevilla', start: '2026-11-04T17:00:00', end: '2026-11-04T19:00:00', status: 'confirmed' },
    { title: 'Junta de Facultad extraordinaria', start: '2026-11-05T12:00:00', end: '2026-11-05T13:30:00', status: 'confirmed' },
    { title: 'Tutoría grupal de alumnos de nuevo ingreso', start: '2026-11-06T10:00:00', end: '2026-11-06T11:30:00', status: 'confirmed' },
    { title: 'Firma de convenio con empresa eólica (Suspendida)', start: '2026-10-22T12:00:00', end: '2026-10-22T13:00:00', status: 'cancelled' },
    { title: 'Visita guiada a la planta de biogás (Cancelada)', start: '2026-10-29T10:00:00', end: '2026-10-29T13:00:00', status: 'cancelled' },
    { title: 'Curso de primeros auxilios (Pospuesto)', start: '2026-11-02T16:00:00', end: '2026-11-02T19:00:00', status: 'cancelled' },
    { title: 'Desayuno de trabajo con colaboradores (Cancelado)', start: '2026-11-14T09:00:00', end: '2026-11-14T10:00:00', status: 'cancelled' },
    { title: 'Reunión preparatoria con equipo de voluntarios', start: '2026-11-10T12:00:00', end: '2026-11-10T13:30:00', status: 'confirmed' },
    { title: 'Sesión técnica: Reducción de consumo energético', start: '2026-11-11T10:00:00', end: '2026-11-11T12:00:00', status: 'confirmed' },
    { title: 'Montaje de cartelería y stands en el patio central', start: '2026-11-13T08:00:00', end: '2026-11-13T14:00:00', status: 'confirmed' },
    { title: 'Apertura de las Jornadas de Sostenibilidad 2026', start: '2026-11-17T09:00:00', end: '2026-11-17T11:00:00', status: 'confirmed' },
    { title: 'Ponencia principal: Clima y futuro universitario', start: '2026-11-17T11:30:00', end: '2026-11-17T13:00:00', status: 'confirmed' },
    { title: 'Entrega de Premios a las Mejores Prácticas Verdes', start: '2026-11-18T18:00:00', end: '2026-11-18T20:00:00', status: 'confirmed' },
    { title: 'Reunión de balance y conclusiones de las Jornadas', start: '2026-11-23T11:00:00', end: '2026-11-23T12:30:00', status: 'confirmed' },
    { title: 'Consejo de Gobierno universitario ordinario', start: '2026-11-26T09:30:00', end: '2026-11-26T14:00:00', status: 'confirmed' },
    { title: 'Reunión de coordinación de presupuestos 2027', start: '2026-12-02T10:00:00', end: '2026-12-02T12:00:00', status: 'confirmed' },
    { title: 'Cena de navidad del centro', start: '2026-12-18T21:00:00', end: '2026-12-19T00:00:00', status: 'confirmed' },
    { title: 'Cierre anual de facturación y proyectos', start: '2026-12-22T09:00:00', end: '2026-12-22T13:00:00', status: 'confirmed' },
  ];

  let evPtr = 0;
  while (events.length < 48) {
    const tmpl = eventTemplates[evPtr % eventTemplates.length];
    const offset = events.length;
    const isPast = offset < 24;
    const month = isPast ? '10' : '11';
    const day = ((offset % 25) + 1).toString().padStart(2, '0');
    const hour = (9 + (offset % 8)).toString().padStart(2, '0');

    events.push({
      id: `evt_gen_${(offset + 1).toString().padStart(3, '0')}`,
      title: `${tmpl.title} (#${offset + 1})`,
      description: 'Actividad institucional en el campus.',
      startAt: `2026-${month}-${day}T${hour}:00:00`,
      endAt: `2026-${month}-${day}T${hour}:45:00`,
      location: `Edificio de Gestión - Sala ${(offset % 10) + 1}`,
      organizerContactId: contacts[offset % contacts.length].id,
      attendeeContactIds: [contacts[(offset + 1) % contacts.length].id],
      currentUserRole: offset % 4 === 0 ? 'organizer' : 'attendee',
      response: 'accepted',
      status: tmpl.status as any,
      linkedFileIds: [],
    });
    evPtr++;
  }

  return events;
}

function buildScoringCases(): ScoringCase[] {
  const cases: ScoringCase[] = [];

  // MAIL cases (MAIL-001 to MAIL-030)
  cases.push(
    {
      id: 'MAIL-001',
      module: 'mail',
      entityIds: ['msg_mail001'],
      entityRoles: { msg_mail001: 'redundant' },
      title: 'Boletín semanal antiguo sin valor',
      context: 'Boletín antiguo repetido sin contenido relevante.',
      learningPoint: 'Los boletines antiguos y repetidos deben eliminarse definitivamente.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Boletín obsoleto eliminado definitivamente.' },
        { actionId: 'mail.archive', outcome: 'partial', explanation: 'Archivar organiza, pero conserva un boletín prescindible.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Mover a papelera es reversible y no resuelve el caso.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-002',
      module: 'mail',
      entityIds: ['msg_mail002'],
      entityRoles: { msg_mail002: 'important' },
      title: 'Aviso administrativo de matrícula (Justificante)',
      context: 'Justificante histórico que conviene archivar.',
      learningPoint: 'Los justificantes deben conservarse archivados adecuadamente.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Justificante administrativo archivado correctamente.' },
        { actionId: 'mail.moveToFolder', targetFolderId: 'archive_admin', outcome: 'good', explanation: 'Movido a carpeta de Administración.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó definitivamente un justificante probatorio único.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-003',
      module: 'mail',
      entityIds: ['msg_mail003_can', 'msg_mail003_dup'],
      entityRoles: { msg_mail003_can: 'canonical', msg_mail003_dup: 'redundant' },
      title: 'Conversación con PDF repetido en respuestas',
      context: 'Varios correos adjuntan el mismo PDF pesado existiendo copia canónica.',
      learningPoint: 'Eliminar copias repetidas manteniendo la versión canónica.',
      decisionRules: [
        { actionId: 'mail.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Copia adjunta redundante eliminada.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Hilo archivado.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Enviado a papelera sin resolver.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-004',
      module: 'mail',
      entityIds: ['msg_mail004_val', 'msg_mail004_dup'],
      entityRoles: { msg_mail004_val: 'canonical', msg_mail004_dup: 'redundant' },
      title: 'Factura duplicada con hilo de aprobación',
      context: 'Una copia contiene la aprobación y la otra es redundante.',
      learningPoint: 'Conservar la copia con validez legal y descartar la copia suelta.',
      decisionRules: [
        { actionId: 'mail.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Duplicado de factura eliminado correctamente.' },
        { actionId: 'mail.archive', targetEntityRole: 'canonical', outcome: 'good', explanation: 'Factura aprobada archivada.' },
        { actionId: 'mail.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó la factura con aprobación oficial.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-005',
      module: 'mail',
      entityIds: ['msg_MAIL-005'],
      entityRoles: { 'msg_MAIL-005': 'important' },
      title: 'Recibo único de matrícula/pago',
      context: 'Recibo único necesario para reclamaciones.',
      learningPoint: 'Los recibos únicos deben preservarse.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Recibo archivado adecuadamente.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Marcado como destacado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó un recibo bancario único.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-006',
      module: 'mail',
      entityIds: ['msg_MAIL-006'],
      entityRoles: { 'msg_MAIL-006': 'obsolete' },
      title: 'Newsletter promocional antigua',
      context: 'Cadena publicitaria caducada sin valor documental.',
      learningPoint: 'La publicidad antigua no debe conservarse.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Publicidad obsoleta eliminada definitivamente.' },
        { actionId: 'mail.archive', outcome: 'partial', explanation: 'Archivar publicidad no es la mejor práctica.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Paso reversible sin resolver.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-007',
      module: 'mail',
      entityIds: ['msg_MAIL-007'],
      entityRoles: { 'msg_MAIL-007': 'important' },
      title: 'Borrador importante con vídeo adjunto pesado',
      context: 'El vídeo ya existe en OneDrive y debe reemplazarse por enlace.',
      learningPoint: 'Reemplazar adjuntos pesados por enlaces compartidos en borradores.',
      decisionRules: [
        { actionId: 'mail.replaceDraftAttachmentWithLink', outcome: 'optimal', explanation: 'Adjunto pesado sustituido por enlace al original.' },
        { actionId: 'mail.saveDraft', outcome: 'neutral', explanation: 'Borrador guardado sin cambios.' },
        { actionId: 'mail.deleteForever', outcome: 'harmful', explanation: 'Se eliminó el borrador de trabajo completo.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-008',
      module: 'mail',
      entityIds: ['msg_MAIL-008'],
      entityRoles: { 'msg_MAIL-008': 'important' },
      title: 'Correo con adjunto único de trabajo',
      context: 'Documento aún no guardado en otro sitio.',
      learningPoint: 'No eliminar correos con adjuntos únicos no respaldados.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Correo de trabajo archivado.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacado para seguimiento.' },
        { actionId: 'mail.saveAttachmentToDrive', outcome: 'neutral', explanation: 'Guardado en OneDrive (crea copia).' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Eliminado correo con datos de trabajo únicos.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-009',
      module: 'mail',
      entityIds: ['msg_MAIL-009'],
      entityRoles: { 'msg_MAIL-009': 'obsolete' },
      title: 'Mensaje de phishing de falso soporte',
      context: 'Intento de suplantación técnica.',
      learningPoint: 'Marcar el phishing como no deseado.',
      decisionRules: [
        { actionId: 'mail.markJunk', outcome: 'optimal', explanation: 'Phishing clasificado como correo no deseado.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Paso reversible.' },
        { actionId: 'mail.archive', outcome: 'harmful', explanation: 'No se debe archivar phishing en carpetas de confianza.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-010',
      module: 'mail',
      entityIds: ['msg_MAIL-010'],
      entityRoles: { 'msg_MAIL-010': 'important' },
      title: 'Mensaje legítimo en correo no deseado',
      context: 'Presupuesto de proveedor en spam por error.',
      learningPoint: 'Rescatar correos válidos clasificados como spam erróneamente.',
      decisionRules: [
        { actionId: 'mail.removeFromJunk', outcome: 'optimal', explanation: 'Mensaje legítimo devuelto a bandeja principal.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Archivado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó definitivamente un presupuesto legítimo.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-011',
      module: 'mail',
      entityIds: ['msg_MAIL-011'],
      entityRoles: { 'msg_MAIL-011': 'important' },
      title: 'Correo con plazo de respuesta vigente sin leer',
      context: 'Alegaciones pendientes que vencen mañana.',
      learningPoint: 'Identificar y destacar mensajes urgentes no leídos.',
      decisionRules: [
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacado para atención inmediata.' },
        { actionId: 'mail.markUnread', outcome: 'good', explanation: 'Mantenido como no leído para seguimiento.' },
        { actionId: 'mail.archive', outcome: 'harmful', explanation: 'Archivar un correo urgente sin atender es un error.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó un trámite oficial con plazo abierto.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-012',
      module: 'mail',
      entityIds: ['msg_MAIL-012'],
      entityRoles: { 'msg_MAIL-012': 'historical' },
      title: 'Notificación de reunión cancelada',
      context: 'Aviso de reunión cancelada que no debe quedar en Recibidos.',
      learningPoint: 'Archivar avisos de cancelación para despejar la bandeja.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Notificación archivada despejando Recibidos.' },
        { actionId: 'mail.moveToFolder', outcome: 'good', explanation: 'Movido a carpeta histórica.' },
        { actionId: 'mail.deleteForever', outcome: 'partial', explanation: 'Eliminado aviso menor.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-013',
      module: 'mail',
      entityIds: ['msg_MAIL-013'],
      entityRoles: { 'msg_MAIL-013': 'obsolete' },
      title: 'Borrador antiguo de campaña cancelada',
      context: 'Borrador sin contenido aprovechable.',
      learningPoint: 'Limpiar borradores antiguos inservibles.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Borrador inútil eliminado.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
        { actionId: 'mail.saveDraft', outcome: 'neutral', explanation: 'Mantenido en borradores.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-014',
      module: 'mail',
      entityIds: ['msg_MAIL-014'],
      entityRoles: { 'msg_MAIL-014': 'important' },
      title: 'Borrador actual con propuesta única',
      context: 'Texto de trabajo en curso.',
      learningPoint: 'Preservar borradores con redacción activa.',
      decisionRules: [
        { actionId: 'mail.saveDraft', outcome: 'optimal', explanation: 'Borrador de trabajo guardado.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se destruyó un texto de trabajo en redacción.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-015',
      module: 'mail',
      entityIds: ['msg_MAIL-015'],
      entityRoles: { 'msg_MAIL-015': 'redundant' },
      title: 'Borrador con presentación de 80 MB duplicada',
      context: 'Presentación pesada que debe enviarse como enlace.',
      learningPoint: 'Evitar reenviar archivos de 80 MB adjuntos.',
      decisionRules: [
        { actionId: 'mail.replaceDraftAttachmentWithLink', outcome: 'optimal', explanation: 'Adjunto de 80 MB sustituido por enlace.' },
        { actionId: 'mail.send', outcome: 'neutral', explanation: 'Enviado con archivo físico.' },
        { actionId: 'mail.deleteForever', outcome: 'harmful', explanation: 'Borrador borrado por completo.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-016',
      module: 'mail',
      entityIds: ['msg_MAIL-016'],
      entityRoles: { 'msg_MAIL-016': 'important' },
      title: 'Política vigente de RR.HH. con enlace oficial',
      context: 'Normativa institucional activa.',
      learningPoint: 'Las políticas de RR.HH. activas no deben eliminarse.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Normativa archivada para consulta.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacada.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se borró una circular de política institucional activa.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-017',
      module: 'mail',
      entityIds: ['msg_MAIL-017'],
      entityRoles: { 'msg_MAIL-017': 'obsolete' },
      title: 'Avisos de plataforma dada de baja',
      context: 'Alertas automáticas sin necesidad de retención.',
      learningPoint: 'Eliminar registros automáticos de sistemas extintos.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Alertas extintas eliminadas definitivamente.' },
        { actionId: 'mail.archive', outcome: 'partial', explanation: 'Archivar no limpia el desorden.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-018',
      module: 'mail',
      entityIds: ['msg_MAIL-018'],
      entityRoles: { 'msg_MAIL-018': 'important' },
      title: 'Acta firmada única',
      context: 'Documento probatorio institucional.',
      learningPoint: 'Las actas firmadas son documentos probatorios de conservación obligatoria.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Acta firmada archivada de forma segura.' },
        { actionId: 'mail.moveToFolder', targetFolderId: 'archive_actas', outcome: 'good', explanation: 'Movida a carpeta de Actas.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó un acta fundacional con firma digital.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-019',
      module: 'mail',
      entityIds: ['msg_MAIL-019'],
      entityRoles: { 'msg_MAIL-019': 'redundant' },
      title: 'Fotos con copia canónica en OneDrive',
      context: 'Fotos ya guardadas en la biblioteca oficial.',
      learningPoint: 'Eliminar copias pesadas por correo si el repositorio oficial ya las aloja.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Copia adjunta redundante eliminada.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Mensaje archivado.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se eliminó el original en OneDrive.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-020',
      module: 'mail',
      entityIds: ['msg_MAIL-020'],
      entityRoles: { 'msg_MAIL-020': 'canonical' },
      title: 'Conversación masiva con decisión final',
      context: 'Última respuesta de la cadena que contiene el acuerdo.',
      learningPoint: 'Conservar la respuesta con el acuerdo final y eliminar los correos intermedios.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Respuesta con decisión final archivada.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se destruyó la respuesta con el acuerdo final.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-021',
      module: 'mail',
      entityIds: ['msg_MAIL-021'],
      entityRoles: { 'msg_MAIL-021': 'important' },
      title: 'Invitación a evento futuro vigente',
      context: 'Enlace de acceso a las próximas jornadas.',
      learningPoint: 'Conservar invitaciones a eventos futuros.',
      decisionRules: [
        { actionId: 'mail.star', outcome: 'good', explanation: 'Invitación destacada.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Archivada con acceso asegurado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó la invitación oficial al evento.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-022',
      module: 'mail',
      entityIds: ['msg_MAIL-022'],
      entityRoles: { 'msg_MAIL-022': 'obsolete' },
      title: 'Correo basura repetitivo',
      context: 'Avisos mecánicos sin valor.',
      learningPoint: 'Clasificar spam para entrenar filtros o eliminar.',
      decisionRules: [
        { actionId: 'mail.markJunk', outcome: 'optimal', explanation: 'Marcado como correo no deseado.' },
        { actionId: 'mail.deleteForever', outcome: 'good', explanation: 'Eliminado definitivamente.' },
        { actionId: 'mail.archive', outcome: 'harmful', explanation: 'Archivar basura contamina el archivo.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-023',
      module: 'mail',
      entityIds: ['msg_MAIL-023'],
      entityRoles: { 'msg_MAIL-023': 'historical' },
      title: 'Confirmación de reserva completada',
      context: 'Recibo de reserva de sala.',
      learningPoint: 'Archivar recibos de reservas completadas.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'optimal', explanation: 'Recibo de reserva archivado.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacado.' },
        { actionId: 'mail.deleteForever', outcome: 'harmful', explanation: 'Se eliminó el comprobante de reserva.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-024',
      module: 'mail',
      entityIds: ['msg_MAIL-024'],
      entityRoles: { 'msg_MAIL-024': 'redundant' },
      title: 'Duplicado de informe mensual grande',
      context: 'El original se encuentra en Archivados.',
      learningPoint: 'Eliminar duplicados pesados manteniendo el original archivado.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Duplicado de informe eliminado definitivamente.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Archivado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Borrado erróneo.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-025',
      module: 'mail',
      entityIds: ['msg_MAIL-025'],
      entityRoles: { 'msg_MAIL-025': 'important' },
      title: 'Datos de investigación activa',
      context: 'Mediciones no duplicadas en otra ubicación.',
      learningPoint: 'No eliminar datos de investigación científica en curso.',
      decisionRules: [
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Datos de investigación preservados.' },
        { actionId: 'mail.star', outcome: 'good', explanation: 'Destacado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se destruyeron mediciones de investigación únicas.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-026',
      module: 'mail',
      entityIds: ['msg_MAIL-026'],
      entityRoles: { 'msg_MAIL-026': 'obsolete' },
      title: 'Spam con archivo sospechoso',
      context: 'Oferta con fichero adjunto ejecutable.',
      learningPoint: 'Marcar spam y no abrir adjuntos sospechosos.',
      decisionRules: [
        { actionId: 'mail.markJunk', outcome: 'optimal', explanation: 'Spam peligroso marcado como no deseado.' },
        { actionId: 'mail.deleteForever', outcome: 'good', explanation: 'Eliminado.' },
        { actionId: 'mail.saveAttachmentToDrive', outcome: 'harmful', explanation: 'Guardar un ejecutable sospechoso pone en riesgo el sistema.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-027',
      module: 'mail',
      entityIds: ['msg_MAIL-027'],
      entityRoles: { 'msg_MAIL-027': 'obsolete' },
      title: 'Notificación de sistema antigua resuelta',
      context: 'Corte de agua de hace 6 meses.',
      learningPoint: 'Eliminar notificaciones operativas ya resueltas.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Notificación caducada eliminada definitivamente.' },
        { actionId: 'mail.archive', outcome: 'partial', explanation: 'Archivado parcial.' },
        { actionId: 'mail.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-028',
      module: 'mail',
      entityIds: ['msg_MAIL-028'],
      entityRoles: { 'msg_MAIL-028': 'important' },
      title: 'Mensaje de coordinación urgente sin leer',
      context: 'Asignación de aulas de ponentes.',
      learningPoint: 'Destacar correos de coordinación pendientes.',
      decisionRules: [
        { actionId: 'mail.star', outcome: 'optimal', explanation: 'Mensaje urgente destacado.' },
        { actionId: 'mail.markUnread', outcome: 'good', explanation: 'Mantenido como no leído.' },
        { actionId: 'mail.archive', outcome: 'harmful', explanation: 'Archivar un correo urgente sin responder.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se eliminó la petición de la decana.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-029',
      module: 'mail',
      entityIds: ['msg_MAIL-029'],
      entityRoles: { 'msg_MAIL-029': 'redundant' },
      title: 'Versión antigua de presentación con erratas',
      context: 'Existe versión definitiva aprobada.',
      learningPoint: 'Eliminar borradores antiguos con fallos.',
      decisionRules: [
        { actionId: 'mail.deleteForever', outcome: 'optimal', explanation: 'Borrador con erratas eliminado.' },
        { actionId: 'mail.archive', outcome: 'good', explanation: 'Archivado.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Borrado de versión final.' },
      ],
      status: 'pending',
    },
    {
      id: 'MAIL-030',
      module: 'mail',
      entityIds: ['msg_MAIL-030'],
      entityRoles: { 'msg_MAIL-030': 'important' },
      title: 'Papelera mixta con justificante único',
      context: 'Justificante en papelera por error.',
      learningPoint: 'Revisar la papelera antes de vaciarla y restaurar lo importante.',
      decisionRules: [
        { actionId: 'mail.restore', outcome: 'good', explanation: 'Justificante rescatado de la papelera.' },
        { actionId: 'mail.deleteForever', outcome: 'critical', explanation: 'Se destruyó definitivamente el justificante en la papelera.' },
        { actionId: 'mail.emptyTrash', outcome: 'critical', explanation: 'Vaciar la papelera sin revisar destruyó el documento único.' },
      ],
      status: 'pending',
    }
  );

  // FILE cases (FILE-001 to FILE-025)
  cases.push(
    {
      id: 'FILE-001',
      module: 'files',
      entityIds: ['file_001_can', 'file_001_dup1', 'file_001_dup2'],
      entityRoles: { file_001_can: 'canonical', file_001_dup1: 'redundant', file_001_dup2: 'redundant' },
      title: 'Tres copias de presentación final en distintas carpetas',
      context: 'Una copia es la canónica y compartida; las otras dos son duplicados.',
      learningPoint: 'Eliminar copias redundantes manteniendo la copia canónica.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Copia redundante eliminada definitivamente liberando espacio.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó la presentación canónica compartida con el comité.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-002',
      module: 'files',
      entityIds: ['file_002'],
      entityRoles: { file_002: 'obsolete' },
      title: 'Instalador de software antiguo (MSI 320 MB)',
      context: 'El programa ya está instalado; el instalador es prescindible.',
      learningPoint: 'Los instaladores de software ya instalado consumen espacio innecesario.',
      decisionRules: [
        { actionId: 'file.deleteForever', outcome: 'optimal', explanation: 'Instalador obsoleto eliminado liberando 320 MB.' },
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_18', outcome: 'partial', explanation: 'Movido a Revisar antes de eliminar.' },
        { actionId: 'file.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-003',
      module: 'files',
      entityIds: ['file_003'],
      entityRoles: { file_003: 'important' },
      title: 'Vídeo máster original de jornada (1,4 GB)',
      context: 'Sin copia alternativa; debe conservarse en Archivo histórico.',
      learningPoint: 'No eliminar vídeos grandes si constituyen la única grabación histórica.',
      decisionRules: [
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_16', outcome: 'good', explanation: 'Vídeo máster trasladado a Archivo histórico.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se destruyó la única grabación máster del evento.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-004',
      module: 'files',
      entityIds: ['file_004'],
      entityRoles: { file_004: 'obsolete' },
      title: 'Caché temporal de exportación de vídeo (180 MB)',
      context: 'Fichero regenerable que puede borrarse con seguridad.',
      learningPoint: 'Eliminar archivos de caché para liberar almacenamiento.',
      decisionRules: [
        { actionId: 'file.deleteForever', outcome: 'optimal', explanation: 'Caché temporal eliminada liberando 180 MB.' },
        { actionId: 'file.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-005',
      module: 'files',
      entityIds: ['file_005'],
      entityRoles: { file_005: 'important' },
      title: 'Backup único de fotografías de equipo (420 MB)',
      context: 'Fotografías RAW sin copia en la nube.',
      learningPoint: 'Preservar copias de seguridad de imágenes originales.',
      decisionRules: [
        { actionId: 'file.favorite', outcome: 'good', explanation: 'Marcado como favorito de respaldo.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se destruyeron las fotos RAW originales del equipo.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-006',
      module: 'files',
      entityIds: ['file_006_can', 'file_006_dup'],
      entityRoles: { file_006_can: 'canonical', file_006_dup: 'redundant' },
      title: 'Copia duplicada de informe oficial',
      context: 'La biblioteca oficial ya aloja el documento validado.',
      learningPoint: 'Eliminar copias locales sueltas y utilizar enlaces al original.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Copia duplicada eliminada liberando almacenamiento.' },
        { actionId: 'file.createShareLink', targetEntityRole: 'canonical', outcome: 'good', explanation: 'Enlace al original creado.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó el informe canónico oficial.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-007',
      module: 'files',
      entityIds: ['file_007'],
      entityRoles: { file_007: 'important' },
      title: 'Acta firmada en carpeta temporal',
      context: 'Debe trasladarse a la carpeta de Actas y no eliminarse.',
      learningPoint: 'Reubicar documentos legales en su carpeta oficial en lugar de borrarlos.',
      decisionRules: [
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_10', outcome: 'optimal', explanation: 'Acta firmada trasladada a la carpeta de Actas.' },
        { actionId: 'file.favorite', outcome: 'good', explanation: 'Destacada como documento oficial.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se eliminó un acta oficial con firma.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-008',
      module: 'files',
      entityIds: ['file_008'],
      entityRoles: { file_008: 'canonical' },
      title: 'Historial de versiones con 4 intermedias obsoletas',
      context: 'La versión 5 es la final; las versiones 1 a 4 ocupan 146 MB.',
      learningPoint: 'Depurar versiones intermedias desde el historial de versiones.',
      decisionRules: [
        { actionId: 'file.deleteVersion', outcome: 'optimal', explanation: 'Versiones intermedias obsoletas eliminadas del historial.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se destruyó la versión final de la guía.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-009',
      module: 'files',
      entityIds: ['file_009'],
      entityRoles: { file_009: 'important' },
      title: 'Presupuesto aprobado y firmado',
      context: 'Versión actual con validación económica.',
      learningPoint: 'Conservar los presupuestos firmados vigentes.',
      decisionRules: [
        { actionId: 'file.favorite', outcome: 'good', explanation: 'Marcado como presupuesto vigente.' },
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_11', outcome: 'good', explanation: 'Ubicado en Presupuestos.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se eliminó el presupuesto oficial aprobado.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-010',
      module: 'files',
      entityIds: ['file_010'],
      entityRoles: { file_010: 'obsolete' },
      title: 'Logs temporales de prueba concluida (210 MB)',
      context: 'Prueba de carga cerrada y reproducible.',
      learningPoint: 'Limpiar paquetes de logs de pruebas ya cerradas.',
      decisionRules: [
        { actionId: 'file.deleteForever', outcome: 'optimal', explanation: 'Paquete de logs temporales eliminado definitivamente.' },
        { actionId: 'file.moveToTrash', outcome: 'no_score', explanation: 'Paso a papelera.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-011',
      module: 'files',
      entityIds: ['file_011_can', 'file_011_dup'],
      entityRoles: { file_011_can: 'canonical', file_011_dup: 'redundant' },
      title: 'Dos PDFs idénticos: Escaneo pesado (140 MB) vs OCR (6 MB)',
      context: 'El PDF OCR es más ligero, contiene texto y está validado.',
      learningPoint: 'Comparar y descartar el escaneo sin comprimir manteniendo el optimizado.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Escaneo pesado de 140 MB eliminado; versión OCR conservada.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó el documento optimizado con OCR.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-012',
      module: 'files',
      entityIds: ['file_012_src', 'file_012_png1', 'file_012_png2'],
      entityRoles: { file_012_src: 'canonical', file_012_png1: 'redundant', file_012_png2: 'redundant' },
      title: 'Exportaciones PNG redundantes vs archivo editable PSD',
      context: 'Los PNG intermedios son descartables si se tiene el editable.',
      learningPoint: 'Eliminar exportaciones intermedias conservando el fichero fuente.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Exportaciones PNG redundantes eliminadas.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se destruyó el archivo original editable PSD.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-013',
      module: 'files',
      entityIds: ['file_013'],
      entityRoles: { file_013: 'important' },
      title: 'ZIP con fotos originales de evento 2024 (550 MB)',
      context: 'Único respaldo existente de ese acto.',
      learningPoint: 'No borrar paquetes de fotos si son el único archivo histórico.',
      decisionRules: [
        { actionId: 'file.createShareLink', outcome: 'good', explanation: 'Enlace creado para compartir sin duplicar.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se eliminó el único archivo fotográfico del evento.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-014',
      module: 'files',
      entityIds: ['file_014'],
      entityRoles: { file_014: 'canonical' },
      title: 'Vídeo 4K de 1,2 GB para compartir con el equipo',
      context: 'Debe compartirse por enlace para evitar crear copias.',
      learningPoint: 'Crear enlaces compartidos para distribuir ficheros voluminosos.',
      decisionRules: [
        { actionId: 'file.createShareLink', outcome: 'optimal', explanation: 'Enlace de acceso compartido creado sin duplicar 1,2 GB.' },
        { actionId: 'file.copyLink', outcome: 'good', explanation: 'Enlace copiado al portapapeles.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-015',
      module: 'files',
      entityIds: ['file_015_val', 'file_015_cor'],
      entityRoles: { file_015_val: 'canonical', file_015_cor: 'redundant' },
      title: 'Audio duplicado: copia corrupta vs copia válida',
      context: 'Una copia está dañada y la otra reproduce con claridad.',
      learningPoint: 'Comprobar integridad antes de borrar y descartar la copia dañada.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Audio dañado eliminado correctamente.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se borró el audio válido que sonaba bien.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-016',
      module: 'files',
      entityIds: ['file_016'],
      entityRoles: { file_016: 'important' },
      title: 'Archivo confidencial con enlace público',
      context: 'Nóminas expuestas a cualquiera con el enlace.',
      learningPoint: 'Restringir accesos públicos en documentos confidenciales.',
      decisionRules: [
        { actionId: 'file.updateShareAccess', outcome: 'optimal', explanation: 'Acceso restringido a miembros autorizados de la organización.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-017',
      module: 'files',
      entityIds: ['file_017'],
      entityRoles: { file_017: 'important' },
      title: 'Enlace público antiguo a campaña cerrada',
      context: 'Revocar el enlace público sin borrar el archivo original.',
      learningPoint: 'Revocar enlaces obsoletos sin destruir el archivo que referencian.',
      decisionRules: [
        { actionId: 'file.revokeShareLink', outcome: 'optimal', explanation: 'Enlace compartido revocado; documento preservado.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se eliminó el documento histórico en lugar de revocar el enlace.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-018',
      module: 'files',
      entityIds: ['file_018_fin', 'file_018_tmp1', 'file_018_tmp2'],
      entityRoles: { file_018_fin: 'canonical', file_018_tmp1: 'redundant', file_018_tmp2: 'redundant' },
      title: 'Dossier final y dos copias temporales grandes',
      context: 'Conservar la versión final y borrar los descartes temporales.',
      learningPoint: 'Saneamiento de borradores grandes de diseño.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Borradores temporales de 95 MB eliminados.' },
        { actionId: 'file.moveToFolder', targetEntityRole: 'canonical', targetFolderId: 'folder_16', outcome: 'good', explanation: 'Dossier final guardado en Archivo histórico.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se destruyó la versión final del dossier.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-019',
      module: 'files',
      entityIds: ['file_019_tmp'],
      entityRoles: { file_019_tmp: 'obsolete' },
      title: 'Toma falsa de vídeo de 750 MB',
      context: 'El vídeo final está editado y publicado.',
      learningPoint: 'Descartar tomas fallidas de vídeo que ocupan gigabytes.',
      decisionRules: [
        { actionId: 'file.deleteForever', outcome: 'optimal', explanation: 'Toma falsa de 750 MB eliminada definitivamente.' },
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_18', outcome: 'partial', explanation: 'Movida a revisión.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-020',
      module: 'files',
      entityIds: ['file_020_loc', 'file_020_cld'],
      entityRoles: { file_020_loc: 'redundant', file_020_cld: 'canonical' },
      title: 'Backup local antiguo verificado en OneDrive (380 MB)',
      context: 'Ambas copias son idénticas; la copia en nube está protegida.',
      learningPoint: 'Liberar duplicados locales cuando el respaldo en la nube está verificado.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Backup redundante de 380 MB eliminado.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se destruyó la copia en nube.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-021',
      module: 'files',
      entityIds: ['file_021'],
      entityRoles: { file_021: 'important' },
      title: 'Backup único con nota "no eliminar" (490 MB)',
      context: 'Sin copia en la nube; debe conservarse.',
      learningPoint: 'Respetar advertencias de respaldo en proyectos únicos.',
      decisionRules: [
        { actionId: 'file.favorite', outcome: 'good', explanation: 'Protegido como favorito.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se ignoró la advertencia de no eliminar el backup único.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-022',
      module: 'files',
      entityIds: ['file_022_can', 'file_022_dup1', 'file_022_dup2', 'file_022_dup3', 'file_022_dup4'],
      entityRoles: {
        file_022_can: 'canonical',
        file_022_dup1: 'redundant',
        file_022_dup2: 'redundant',
        file_022_dup3: 'redundant',
        file_022_dup4: 'redundant',
      },
      title: 'Cinco copias del protocolo (Versión firmada es canónica)',
      context: 'Cuatro copias redundantes repartidas por distintas carpetas.',
      learningPoint: 'Unificar copias dispersas en una única versión oficial.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Copia dispersa eliminada.' },
        { actionId: 'file.createShareLink', targetEntityRole: 'canonical', outcome: 'good', explanation: 'Enlace al canónico creado.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó el protocolo firmado oficial.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-023',
      module: 'files',
      entityIds: ['file_023'],
      entityRoles: { file_023: 'canonical' },
      title: 'Archivo ZIP de 300 MB reenviado habitualmente',
      context: 'Debe mantenerse en OneDrive y compartirse por enlace.',
      learningPoint: 'Gestionar repositorios centrales en lugar de adjuntar 300 MB por correo.',
      decisionRules: [
        { actionId: 'file.createShareLink', outcome: 'good', explanation: 'Enlace creado para envíos futuros.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se destruyó la fuente gráfica de 300 MB.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-024',
      module: 'files',
      entityIds: ['file_024_can', 'file_024_dup'],
      entityRoles: { file_024_can: 'canonical', file_024_dup: 'redundant' },
      title: 'Documento duplicado con diferente nombre',
      context: 'Contenido exactamente idéntico al plan final vigente.',
      learningPoint: 'Comparar contenido y fecha antes de conservar nombres engañosos.',
      decisionRules: [
        { actionId: 'file.deleteForever', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Copia redundante eliminada.' },
        { actionId: 'file.moveToFolder', targetEntityRole: 'redundant', targetFolderId: 'folder_18', outcome: 'partial', explanation: 'Movido a revisión.' },
        { actionId: 'file.deleteForever', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se borró el plan estratégico oficial.' },
      ],
      status: 'pending',
    },
    {
      id: 'FILE-025',
      module: 'files',
      entityIds: ['file_025'],
      entityRoles: { file_025: 'important' },
      title: 'Convenio marco firmado de 2021',
      context: 'Documento histórico con vigencia jurídica.',
      learningPoint: 'Mover a Archivo histórico los convenios antiguos que sustentan proyectos vigentes.',
      decisionRules: [
        { actionId: 'file.moveToFolder', targetFolderId: 'folder_16', outcome: 'optimal', explanation: 'Convenio trasladado a Archivo histórico.' },
        { actionId: 'file.favorite', outcome: 'good', explanation: 'Marcado como documento de referencia.' },
        { actionId: 'file.deleteForever', outcome: 'critical', explanation: 'Se destruyó la base jurídica del convenio marco.' },
      ],
      status: 'pending',
    }
  );

  // CALENDAR cases (CAL-001 to CAL-008)
  cases.push(
    {
      id: 'CAL-001',
      module: 'calendar',
      entityIds: ['evt_cal001'],
      entityRoles: { evt_cal001: 'obsolete' },
      title: 'Invitación cancelada que sigue en calendario personal',
      context: 'El organizador canceló el seminario pero permanece en la vista.',
      learningPoint: 'Eliminar del calendario personal eventos que ya fueron cancelados.',
      decisionRules: [
        { actionId: 'event.removeFromPersonalCalendar', outcome: 'optimal', explanation: 'Evento cancelado retirado de la vista personal.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-002',
      module: 'calendar',
      entityIds: ['evt_cal002_can', 'evt_cal002_dup'],
      entityRoles: { evt_cal002_can: 'canonical', evt_cal002_dup: 'redundant' },
      title: 'Dos eventos duplicados a la misma hora',
      context: 'Uno contiene las notas definitivas del reparto presupuestario.',
      learningPoint: 'Eliminar el evento duplicado conservando el que contiene la información completa.',
      decisionRules: [
        { actionId: 'event.removeFromPersonalCalendar', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Evento duplicado sin notas retirado.' },
        { actionId: 'event.removeFromPersonalCalendar', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se eliminó la reunión que contenía las notas definitivas.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-003',
      module: 'calendar',
      entityIds: ['evt_cal003'],
      entityRoles: { evt_cal003: 'important' },
      title: 'Reunión futura obligatoria de preparación de jornadas',
      context: 'Cita clave con vicerrector y decanos.',
      learningPoint: 'Confirmar asistencia a reuniones obligatorias y no eliminarlas.',
      decisionRules: [
        { actionId: 'event.accept', outcome: 'good', explanation: 'Asistencia confirmada a la reunión obligatoria.' },
        { actionId: 'event.cancelOwned', outcome: 'critical', explanation: 'Se canceló indebidamente una reunión institucional obligatoria.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-004',
      module: 'calendar',
      entityIds: ['evt_cal004'],
      entityRoles: { evt_cal004: 'obsolete' },
      title: 'Reunión rutinaria pasada de hace dos meses',
      context: 'Revisión operativa sin necesidad histórica.',
      learningPoint: 'Limpiar reuniones pasadas rutinarias sin valor documental.',
      decisionRules: [
        { actionId: 'event.removeFromPersonalCalendar', outcome: 'good', explanation: 'Reunión pasada de fotocopiadoras retirada de la agenda.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-005',
      module: 'calendar',
      entityIds: ['evt_cal005'],
      entityRoles: { evt_cal005: 'obsolete' },
      title: 'Invitación antigua de un proveedor',
      context: 'Ya no formas parte del proyecto ni gestionas esas compras.',
      learningPoint: 'Rechazar invitaciones a las que ya no corresponde asistir.',
      decisionRules: [
        { actionId: 'event.decline', outcome: 'optimal', explanation: 'Invitación rechazada formalmente.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-006',
      module: 'calendar',
      entityIds: ['evt_cal006'],
      entityRoles: { evt_cal006: 'obsolete' },
      title: 'Reunión acordada como cancelada (Organizador)',
      context: 'El usuario organiza el taller y el equipo acordó cancelarlo.',
      learningPoint: 'Como organizador, cancelar el evento para avisar a los participantes.',
      decisionRules: [
        { actionId: 'event.cancelOwned', outcome: 'optimal', explanation: 'Reunión cancelada formalmente como organizador.' },
        { actionId: 'event.removeFromPersonalCalendar', outcome: 'partial', explanation: 'Solo se retiró del calendario propio sin avisar a los inscritos.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-007',
      module: 'calendar',
      entityIds: ['evt_cal007'],
      entityRoles: { evt_cal007: 'obsolete' },
      title: 'Serie semanal de obra finalizada en septiembre',
      context: 'La obra terminó; la reunión recurrente sigue ocupando hueco.',
      learningPoint: 'Cancelar toda la serie cuando una actividad recurrente concluye.',
      decisionRules: [
        { actionId: 'event.deleteSeries', outcome: 'optimal', explanation: 'Serie recurrente completa cancelada.' },
        { actionId: 'event.cancelOwned', outcome: 'optimal', explanation: 'Serie recurrente completa cancelada.' },
        { actionId: 'event.deleteOccurrence', outcome: 'partial', explanation: 'Solo se canceló una ocurrencia, la serie sigue activa.' },
      ],
      status: 'pending',
    },
    {
      id: 'CAL-008',
      module: 'calendar',
      entityIds: ['evt_cal008_series', 'evt_cal008_dup_occ'],
      entityRoles: { evt_cal008_series: 'canonical', evt_cal008_dup_occ: 'redundant' },
      title: 'Serie activa con ocurrencia duplicada aislada',
      context: 'Solo debe eliminarse la ocurrencia duplicada, nunca la serie entera.',
      learningPoint: 'Diferenciar entre borrar una ocurrencia suelta y destruir una serie recurrente activa.',
      decisionRules: [
        { actionId: 'event.deleteOccurrence', targetEntityRole: 'redundant', outcome: 'optimal', explanation: 'Ocurrencia aislada duplicada eliminada; la serie semanal sigue activa.' },
        { actionId: 'event.deleteSeries', outcome: 'critical', explanation: 'Se destruyó la serie de coordinación TIC completa por error.' },
      ],
      status: 'pending',
    }
  );

  // CONTACTS cases (CON-001 to CON-010)
  cases.push(
    {
      id: 'CON-001',
      module: 'contacts',
      entityIds: ['cnt_con001_prim', 'cnt_con001_sec'],
      entityRoles: { cnt_con001_prim: 'canonical', cnt_con001_sec: 'redundant' },
      title: 'Duplicado exacto de Elena Gómez',
      context: 'Misma persona con idéntico correo y datos.',
      learningPoint: 'Fusionar duplicados exactos.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'optimal', explanation: 'Contactos fusionados correctamente en una sola ficha limpia.' },
        { actionId: 'contact.delete', targetEntityRole: 'redundant', outcome: 'harmful', explanation: 'Se borró el secundario directamente sin fusionar.' },
        { actionId: 'contact.delete', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se borró la ficha canónica.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-002',
      module: 'contacts',
      entityIds: ['cnt_con002_prim', 'cnt_con002_sec'],
      entityRoles: { cnt_con002_prim: 'canonical', cnt_con002_sec: 'redundant' },
      title: 'Dos fichas de Marcos Ruiz con datos complementarios',
      context: 'Una ficha contiene el teléfono y la otra el cargo y departamento.',
      learningPoint: 'Fusionar preservando la información que falta en la ficha principal.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'optimal', explanation: 'Fusión completada conservando teléfono, cargo y departamento.' },
        { actionId: 'contact.delete', outcome: 'critical', explanation: 'Se borró una ficha perdiendo datos exclusivos no combinados.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-003',
      module: 'contacts',
      entityIds: ['cnt_con003_a', 'cnt_con003_b'],
      entityRoles: { cnt_con003_a: 'canonical', cnt_con003_b: 'canonical' },
      title: 'Dos personas distintas con nombre similar',
      context: 'Profesor de Química vs Técnico de Mantenimiento.',
      learningPoint: 'Verificar correo y cargo antes de fusionar personas diferentes.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'critical', explanation: 'Se fusionaron por error dos personas totalmente diferentes.' },
        { actionId: 'contact.delete', outcome: 'harmful', explanation: 'Se eliminó el contacto de una persona activa del campus.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-004',
      module: 'contacts',
      entityIds: ['cnt_con004'],
      entityRoles: { cnt_con004: 'obsolete' },
      title: 'Contacto de proveedor antiguo con relación finalizada',
      context: 'Contrato concluido en 2023 sin actividad.',
      learningPoint: 'Eliminar contactos comerciales extintos sin dependencias.',
      decisionRules: [
        { actionId: 'contact.delete', outcome: 'good', explanation: 'Contacto de proveedor extinto eliminado.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-005',
      module: 'contacts',
      entityIds: ['cnt_con005'],
      entityRoles: { cnt_con005: 'important' },
      title: 'Contacto clave: Dra. Carmen Soler',
      context: 'Presidenta del comité de las jornadas con eventos pendientes.',
      learningPoint: 'Destacar contactos clave de la organización y nunca borrarlos.',
      decisionRules: [
        { actionId: 'contact.favorite', outcome: 'good', explanation: 'Añadida a contactos favoritos.' },
        { actionId: 'contact.delete', outcome: 'critical', explanation: 'Se destruyó la ficha de la presidenta del comité organizador.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-006',
      module: 'contacts',
      entityIds: ['cnt_con006'],
      entityRoles: { cnt_con006: 'canonical' },
      title: 'Contacto activo con correo antiguo y nuevo en notas',
      context: 'Antonio Beltrán tiene confirmada su nueva dirección en las notas.',
      learningPoint: 'Actualizar direcciones de correo obsoletas usando los datos confirmados.',
      decisionRules: [
        { actionId: 'contact.edit', outcome: 'optimal', explanation: 'Dirección de correo actualizada a la confirmada en notas.' },
        { actionId: 'contact.delete', outcome: 'critical', explanation: 'Se eliminó el contacto del administrador de sistemas.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-007',
      module: 'contacts',
      entityIds: ['cnt_con007_pers', 'cnt_con007_shared'],
      entityRoles: { cnt_con007_pers: 'canonical', cnt_con007_shared: 'canonical' },
      title: 'Contacto personal vs Buzón compartido departamental',
      context: 'El profesor Vicente Morales y la Secretaría de Derecho son entidades distintas.',
      learningPoint: 'No confundir un buzón funcional compartido con una persona individual.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'critical', explanation: 'Se fusionó un buzón departamental compartido con un contacto personal.' },
        { actionId: 'contact.delete', outcome: 'harmful', explanation: 'Se eliminó un buzón o contacto activo.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-008',
      module: 'contacts',
      entityIds: ['cnt_con008_prim', 'cnt_con008_sec'],
      entityRoles: { cnt_con008_prim: 'canonical', cnt_con008_sec: 'redundant' },
      title: 'Duplicado con correo antiguo para conservar como secundario',
      context: 'Patricia Vega: fusionar preservando el correo previo en correos secundarios.',
      learningPoint: 'Fusionar conservando direcciones históricas como secundarias para no perder respuestas.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'optimal', explanation: 'Fusión completada manteniendo el correo anterior como secundario.' },
        { actionId: 'contact.delete', targetEntityRole: 'redundant', outcome: 'harmful', explanation: 'Se borró el correo secundario sin agregarlo a la ficha.' },
        { actionId: 'contact.delete', targetEntityRole: 'canonical', outcome: 'critical', explanation: 'Se borró la ficha principal.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-009',
      module: 'contacts',
      entityIds: ['cnt_con009'],
      entityRoles: { cnt_con009: 'canonical' },
      title: 'Antiguo proveedor para clasificar en grupo "Histórico"',
      context: 'Logística Aljarafe debe clasificarse para trazabilidad de facturas.',
      learningPoint: 'Clasificar contactos inactivos en grupos históricos en lugar de eliminarlos.',
      decisionRules: [
        { actionId: 'contact.addGroup', outcome: 'optimal', explanation: 'Contacto clasificado en el grupo "Histórico".' },
        { actionId: 'contact.delete', outcome: 'critical', explanation: 'Se eliminó un proveedor necesario para la trazabilidad de facturas.' },
      ],
      status: 'pending',
    },
    {
      id: 'CON-010',
      module: 'contacts',
      entityIds: ['cnt_con010_prim', 'cnt_con010_sec'],
      entityRoles: { cnt_con010_prim: 'canonical', cnt_con010_sec: 'redundant' },
      title: 'Dos fichas de Manuel Herrero con eventos relacionados',
      context: 'Una ficha está vinculada al calendario; la otra tiene el móvil directo.',
      learningPoint: 'Fusionar conservando el historial de eventos y añadiendo el teléfono móvil.',
      decisionRules: [
        { actionId: 'contact.merge', outcome: 'optimal', explanation: 'Fusión completada combinando el teléfono móvil y preservando eventos asociados.' },
        { actionId: 'contact.delete', outcome: 'critical', explanation: 'Se destruyó la ficha vinculada a eventos del calendario.' },
      ],
      status: 'pending',
    }
  );

  return cases;
}

function calibrateStorageUnits(
  units: StorageUnit[],
  driveFiles: DriveFile[],
  fileVersions: FileVersion[]
): void {
  // Target sum of active and trash units = EXACTLY 34,000,000,000 bytes!
  const TARGET_TOTAL = 34_000_000_000;

  // Find a large active file storage unit to calibrate, e.g. su_f003 (the 1.4 GB master video)
  const masterVideoSu = units.find((u) => u.id === 'su_f003');
  if (!masterVideoSu) {
    throw new Error('Calibration unit su_f003 not found!');
  }

  // Calculate sum of all other active and trash units
  let sumOthers = 0;
  for (const u of units) {
    if (u.id === masterVideoSu.id) continue;
    if (u.status === 'active' || u.status === 'trash') {
      sumOthers += u.sizeBytes;
    }
  }

  const calibratedSize = TARGET_TOTAL - sumOthers;
  if (calibratedSize <= 0) {
    throw new Error(`Invalid calibration size: ${calibratedSize}`);
  }

  masterVideoSu.sizeBytes = calibratedSize;

  // Let's verify sum matches TARGET_TOTAL down to the exact byte
  let verifiedSum = 0;
  for (const u of units) {
    if (u.status === 'active' || u.status === 'trash') {
      verifiedSum += u.sizeBytes;
    }
  }

  if (verifiedSum !== TARGET_TOTAL) {
    throw new Error(`Storage calibration failed: expected ${TARGET_TOTAL}, got ${verifiedSum}`);
  }
}
